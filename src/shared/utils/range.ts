export class Range {
  public readonly min: number
  public readonly max: number
  public readonly options: {
    /**
     * @default true
     */
    inclusive: boolean
  }

  constructor(min: number, max: number, options?: typeof this.options) {
    if (!Number.isFinite(min) || !Number.isFinite(max)) {
      throw new TypeError('min and max must be finite numbers')
    }

    if (min > max) {
      throw new RangeError('min must be <= max')
    }

    this.min = min
    this.max = max

    this.options = {
      ...{ inclusive: true },
      ...options,
    }
  }

  contains(value: number): boolean {
    if (!Number.isFinite(value)) return false

    return this.options.inclusive
      ? value >= this.min && value <= this.max
      : value > this.min && value < this.max
  }

  clamp(value: number): number {
    if (!Number.isFinite(value)) {
      throw new TypeError('value must be a finite number')
    }

    return Math.min(Math.max(value, this.min), this.max)
  }
}
