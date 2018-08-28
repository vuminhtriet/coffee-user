export const getTotalAmount = (amounts, units) => {
  const totalAmounts = []
  amounts.forEach((amount, index) => {
    const unit = units.find(item => item.id === amount.currencyUnitId)
    if (unit) {
      totalAmounts.push(`${amount.value}${unit.code}`)
    }
  })

  let totalAmountStr = totalAmounts[0]
  if (totalAmounts.length > 1) {
    totalAmountStr = totalAmounts.join(' + ')
  }

  // const totalAmountStr = JSON.stringify(totalAmounts) // if (totalAmounts && totalAmounts.len)

  return totalAmountStr
}

// ${currencyUnits[amount.currencyUnitId]}
