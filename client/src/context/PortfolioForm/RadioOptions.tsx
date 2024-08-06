import { Radio, Label } from 'flowbite-react'
import React, { useId } from 'react'

type Props = {
  currency: string
  portfolioCurrency: string
  setPortfolioCurrency: React.Dispatch<React.SetStateAction<string>>
}

export default function ({ currency, portfolioCurrency, setPortfolioCurrency }: Props) {
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
