import { Radio, Label } from 'flowbite-react'
import React, { useId } from 'react'
import type { BaseCurrency } from '@server/shared/types'

type RadioOptionsProps = {
  currency: BaseCurrency
  portfolioCurrency: string
  setPortfolioCurrency: React.Dispatch<React.SetStateAction<BaseCurrency>>
}

export default function RadioOptions({
  currency,
  portfolioCurrency,
  setPortfolioCurrency,
}: RadioOptionsProps) {
  const id = useId()
  return (
    <div className="flex items-center gap-2">
      <Radio
        id={id}
        name={currency}
        value={currency}
        checked={portfolioCurrency === currency}
        onChange={() => setPortfolioCurrency(currency)}
      />
      <Label htmlFor={id} value={currency} />
    </div>
  )
}
