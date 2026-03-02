export type BodyProfile = {
  height: number      // inches
  weight: number      // lbs
  bust: number        // inches
  waist: number       // inches
  hips: number        // inches
  thigh: number       // inches
  inseam: number      // inches
}

export type SizeChart = {
  [size: string]: {
    bust?: { min: number; max: number }
    waist?: { min: number; max: number }
    hips?: { min: number; max: number }
  }
}

export type ProductInfo = {
  name: string
  category: 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes'
  fabric?: string           // e.g. "100% cotton", "95% cotton 5% elastane"
  cutNotes?: string         // e.g. "oversized", "slim fit", "runs small"
  sizeChart?: SizeChart
  modelHeight?: number      // inches
  modelSize?: string        // e.g. "S", "M", "4", "6"
  modelMeasurements?: Partial<BodyProfile>
}

export type FitArea = 'bust' | 'waist' | 'hips' | 'thigh' | 'length'

export type FitForecast = {
  area: FitArea
  result: 'tight' | 'snug' | 'true' | 'relaxed' | 'oversized'
  note?: string
}

export type FitResult = {
  suggestedSize: string
  confidence: 'high' | 'medium' | 'low'
  fitForecast: FitForecast[]
  reasoning: string[]
  warnings: string[]
}

// How stretchy is the fabric? 0 = none, 1 = very stretchy
function getStretchFactor(fabric?: string): number {
  if (!fabric) return 0
  const f = fabric.toLowerCase()
  if (f.includes('elastane') || f.includes('spandex') || f.includes('lycra')) {
    const match = f.match(/(\d+)%\s*(elastane|spandex|lycra)/)
    if (match) {
      const pct = parseInt(match[1])
      if (pct >= 10) return 0.8
      if (pct >= 5) return 0.5
      return 0.3
    }
    return 0.4
  }
  if (f.includes('jersey') || f.includes('knit')) return 0.3
  return 0
}

// Does the cut affect sizing?
function getCutAdjustment(cutNotes?: string): number {
  if (!cutNotes) return 0
  const c = cutNotes.toLowerCase()
  if (c.includes('runs small') || c.includes('slim fit') || c.includes('fitted')) return 1
  if (c.includes('runs large') || c.includes('oversized') || c.includes('relaxed')) return -1
  return 0
}

// Score a single measurement against a range
function scoreMeasurement(
  userMeasurement: number,
  range: { min: number; max: number },
  stretchFactor: number
): FitForecast['result'] {
  const adjustedMax = range.max + (range.max - range.min) * stretchFactor
  const diff = userMeasurement - range.max

  if (userMeasurement < range.min - 2) return 'oversized'
  if (userMeasurement < range.min) return 'relaxed'
  if (userMeasurement <= range.max) return 'true'
  if (userMeasurement <= adjustedMax) return 'snug'
  return 'tight'
}

// Estimate model baseline measurements from height + size
function estimateModelBaseline(
  modelHeight: number,
  modelSize: string
): Partial<BodyProfile> {
  const sizeMap: { [key: string]: Partial<BodyProfile> } = {
    'XS': { bust: 32, waist: 24, hips: 34 },
    'S':  { bust: 34, waist: 26, hips: 36 },
    'M':  { bust: 36, waist: 28, hips: 38 },
    'L':  { bust: 38, waist: 30, hips: 40 },
    'XL': { bust: 40, waist: 32, hips: 42 },
    '0':  { bust: 32, waist: 24, hips: 34 },
    '2':  { bust: 33, waist: 25, hips: 35 },
    '4':  { bust: 34, waist: 26, hips: 36 },
    '6':  { bust: 35, waist: 27, hips: 37 },
    '8':  { bust: 36, waist: 28, hips: 38 },
    '10': { bust: 37, waist: 29, hips: 39 },
    '12': { bust: 38, waist: 30, hips: 40 },
  }
  return sizeMap[modelSize.toUpperCase()] || {}
}

export function runFitEngine(
  body: BodyProfile,
  product: ProductInfo
): FitResult {
  const reasoning: string[] = []
  const warnings: string[] = []
  const fitForecast: FitForecast[] = []
  const stretch = getStretchFactor(product.fabric)
  const cutAdj = getCutAdjustment(product.cutNotes)

  if (stretch > 0) reasoning.push(`Fabric has stretch (factor: ${stretch}) — allows more give.`)
  if (cutAdj > 0) reasoning.push(`Item noted as "${product.cutNotes}" — sizing up recommended.`)
  if (cutAdj < 0) reasoning.push(`Item noted as "${product.cutNotes}" — may size down.`)

  let suggestedSize = 'M'
  let confidence: FitResult['confidence'] = 'low'
  let bestSizeScore = Infinity

  // --- Path 1: Use size chart if available ---
  if (product.sizeChart && Object.keys(product.sizeChart).length > 0) {
    confidence = 'high'
    reasoning.push('Size chart found — using direct measurement mapping.')

    const sizeScores: { size: string; score: number }[] = []

    for (const [size, ranges] of Object.entries(product.sizeChart)) {
      let score = 0
      let checks = 0

      if (ranges.bust && product.category !== 'bottom') {
        const result = scoreMeasurement(body.bust, ranges.bust, stretch)
        if (result === 'tight') score += 3
        else if (result === 'snug') score += 1
        else if (result === 'true') score += 0
        else if (result === 'relaxed') score += 1
        else if (result === 'oversized') score += 3
        checks++
      }
      if (ranges.waist) {
        const result = scoreMeasurement(body.waist, ranges.waist, stretch)
        if (result === 'tight') score += 3
        else if (result === 'snug') score += 1
        else if (result === 'true') score += 0
        else if (result === 'relaxed') score += 1
        else if (result === 'oversized') score += 3
        checks++
      }
      if (ranges.hips && product.category !== 'top') {
        const result = scoreMeasurement(body.hips, ranges.hips, stretch)
        if (result === 'tight') score += 3
        else if (result === 'snug') score += 1
        else if (result === 'true') score += 0
        else if (result === 'relaxed') score += 1
        else if (result === 'oversized') score += 3
        checks++
      }

      sizeScores.push({ size, score: checks > 0 ? score / checks : 99 })
    }

    sizeScores.sort((a, b) => a.score - b.score)
    const bestIdx = Math.max(0, sizeScores.findIndex(s => s.score === sizeScores[0].score) + cutAdj)
    suggestedSize = sizeScores[Math.min(bestIdx, sizeScores.length - 1)].size
    bestSizeScore = sizeScores[0].score

    // Build fit forecast for suggested size
    const chart = product.sizeChart[suggestedSize]
    if (chart) {
      if (chart.bust && product.category !== 'bottom') {
        fitForecast.push({ area: 'bust', result: scoreMeasurement(body.bust, chart.bust, stretch) })
      }
      if (chart.waist) {
        fitForecast.push({ area: 'waist', result: scoreMeasurement(body.waist, chart.waist, stretch) })
      }
      if (chart.hips && product.category !== 'top') {
        fitForecast.push({ area: 'hips', result: scoreMeasurement(body.hips, chart.hips, stretch) })
      }
    }
  }

  // --- Path 2: Use model data if no size chart ---
  if ((!product.sizeChart || Object.keys(product.sizeChart).length === 0) &&
      product.modelHeight && product.modelSize) {
    confidence = 'medium'
    reasoning.push(`No size chart found. Using model comparison (${product.modelHeight}" wearing ${product.modelSize}).`)

    const baseline = product.modelMeasurements ||
      estimateModelBaseline(product.modelHeight, product.modelSize)

    suggestedSize = product.modelSize

    if (baseline.hips && body.hips > baseline.hips + 2) {
      reasoning.push(`Your hips are ${(body.hips - baseline.hips).toFixed(1)}" larger than model baseline → sizing up.`)
      const sizes = ['XS', 'S', 'M', 'L', 'XL']
      const idx = sizes.indexOf(suggestedSize.toUpperCase())
      if (idx < sizes.length - 1) suggestedSize = sizes[idx + 1]
    }
    if (baseline.bust && body.bust > baseline.bust + 2) {
      reasoning.push(`Your bust is ${(body.bust - baseline.bust).toFixed(1)}" larger than model baseline → sizing up.`)
    }
    if (product.modelHeight && body.height < product.modelHeight - 3) {
      const inchDiff = product.modelHeight - body.height
      warnings.push(`Model is ${inchDiff}" taller than you — length may run long.`)
      fitForecast.push({ area: 'length', result: 'oversized', note: `May be ${inchDiff}" too long` })
    }
  }

  // --- Path 3: Body ratio fallback ---
  if (!product.sizeChart && !product.modelHeight) {
    confidence = 'low'
    reasoning.push('Limited product data — using body ratio estimation only.')
    if (body.hips <= 36) suggestedSize = 'XS'
    else if (body.hips <= 38) suggestedSize = 'S'
    else if (body.hips <= 40) suggestedSize = 'M'
    else if (body.hips <= 42) suggestedSize = 'L'
    else suggestedSize = 'XL'
  }

  // Apply cut adjustment to final size
  if (cutAdj !== 0 && confidence !== 'high') {
    const sizes = ['XS', 'S', 'M', 'L', 'XL']
    const idx = sizes.indexOf(suggestedSize.toUpperCase())
    if (idx !== -1) {
      const newIdx = Math.max(0, Math.min(sizes.length - 1, idx + cutAdj))
      suggestedSize = sizes[newIdx]
    }
  }

  return { suggestedSize, confidence, fitForecast, reasoning, warnings }
}