import { createWorker } from 'tesseract.js';
import { Business } from '@/types/admin';

export interface ParsedPromoFromOcr {
  title: string;
  description: string;
  original_price: number;
  offer_price: number;
  discount_percentage: number;
  business_id?: string;
  business_name?: string;
  raw_text: string;
}

export async function scanImageWithOcr(
  imageSource: string | File | Blob,
  onProgress?: (progress: number, status: string) => void
): Promise<ParsedPromoFromOcr> {
  if (onProgress) onProgress(10, 'Iniciando motor OCR...');

  let worker;
  try {
    worker = await createWorker('spa', 1, {
      logger: (m) => {
        if (m.status === 'recognizing text' && onProgress) {
          const pct = Math.round(15 + m.progress * 80);
          onProgress(pct, `Escaneando texto (${Math.round(m.progress * 100)}%)...`);
        }
      },
    });

    if (onProgress) onProgress(30, 'Analizando imagen...');
    const { data } = await worker.recognize(imageSource);
    await worker.terminate();

    const rawText = data.text || '';
    if (onProgress) onProgress(100, 'Lectura completada');

    return parsePromoTextFromOcr(rawText);
  } catch (error) {
    if (worker) {
      try {
        await worker.terminate();
      } catch {
        // ignore
      }
    }
    console.error('OCR Error:', error);
    // Fallback if Tesseract fails on some environments
    throw new Error('No se pudo procesar la imagen con OCR');
  }
}

export function parsePromoTextFromOcr(ocrText: string, businesses: Business[] = []): ParsedPromoFromOcr {
  if (!ocrText) {
    return {
      title: '',
      description: '',
      original_price: 0,
      offer_price: 0,
      discount_percentage: 0,
      raw_text: '',
    };
  }

  const lines = ocrText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  let title = '';
  let description = '';
  let originalPrice = 0;
  let offerPrice = 0;
  let discountPercentage = 0;
  let matchedBusinessId = '';
  let matchedBusinessName = '';

  // 1. Coincidencia de negocio si existe en la lista
  for (const biz of businesses) {
    if (biz.name && ocrText.toLowerCase().includes(biz.name.toLowerCase())) {
      matchedBusinessId = biz.id;
      matchedBusinessName = biz.name;
      break;
    }
  }

  // 2. Extraer Precios (Bs, BOB, $, etc)
  const priceMatches = [...ocrText.matchAll(/(?:Bs\.?|BOB|\$)\s*(\d+(?:[.,]\d+)?)|(\d+(?:[.,]\d+)?)\s*(?:Bs\.?|BOB)/gi)];
  const foundPrices: number[] = [];
  priceMatches.forEach((m) => {
    const val = parseFloat((m[1] || m[2] || '').replace(',', '.'));
    if (!isNaN(val) && val > 0) {
      foundPrices.push(val);
    }
  });

  // Extraer Porcentaje de Descuento (ej: 20%, 50% OFF)
  const discountMatches = [...ocrText.matchAll(/(\d{1,2})\s*%\s*(?:OFF|descuento)?|(?:OFF|descuento)\s*(\d{1,2})\s*%/gi)];
  if (discountMatches.length > 0) {
    const dVal = parseInt(discountMatches[0][1] || discountMatches[0][2] || '0', 10);
    if (dVal > 0 && dVal < 100) {
      discountPercentage = dVal;
    }
  }

  if (foundPrices.length === 1) {
    offerPrice = foundPrices[0];
    if (discountPercentage > 0) {
      originalPrice = Math.round((offerPrice / (1 - discountPercentage / 100)) * 100) / 100;
    }
  } else if (foundPrices.length >= 2) {
    const sorted = [...foundPrices].sort((a, b) => b - a);
    originalPrice = sorted[0];
    offerPrice = sorted[1];
    if (originalPrice > offerPrice && discountPercentage === 0) {
      discountPercentage = Math.round(((originalPrice - offerPrice) / originalPrice) * 100);
    }
  }

  // 3. Extraer Título y Descripción
  const cleanLines = lines.filter(
    (l) => !l.match(/^(?:Bs\.?|BOB|\$)\s*\d+/i) && !l.match(/^\d+\s*%?/i) && l.length >= 3
  );

  if (cleanLines.length > 0) {
    title = cleanLines[0];
    if (cleanLines.length > 1) {
      description = cleanLines.slice(1).join('. ');
    }
  }

  if (!title && lines.length > 0) {
    title = lines[0];
  }

  return {
    title: title.slice(0, 120),
    description: description.slice(0, 500),
    original_price: originalPrice,
    offer_price: offerPrice,
    discount_percentage: discountPercentage,
    business_id: matchedBusinessId,
    business_name: matchedBusinessName,
    raw_text: ocrText,
  };
}
