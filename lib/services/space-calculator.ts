export interface EventConfiguration {
  guestCount: number
  seatingStyle: "round-dining" | "banquet-dining" | "ceremony" | "cocktail"
  buffets: Array<{ type: string; quantity: number }>
  loungeItems: Array<{ type: string; quantity: number }>
  bars: Array<{ type: string; quantity: number }>
  danceFloor: string | null
  hasStage: boolean
}

export interface SpaceComponent {
  type: string
  area: number
  description: string
}

export interface SpaceRequirements {
  totalArea: number
  components: SpaceComponent[]
  recommendedTents: Array<{ size: string; area: number; custom?: boolean }>
  seatingStyle: any
  guestCount: number
}

const SPACE_STANDARDS = {
  seatingStyles: {
    "round-dining": {
      tableType: "round-60",
      chairsPerTable: 8,
      spacePerTable: 28.3, // πr² (5ft radius + 1ft clearance)
      aisleWidth: 4,
      description: "Standard round table dining",
    },
    "banquet-dining": {
      tableType: "banquet-8",
      chairsPerTable: 8,
      spacePerTable: 32, // 8×4 area (table + chairs)
      aisleWidth: 4,
      description: "Banquet table dining",
    },
    ceremony: {
      chairType: "ceremony",
      spacePerChair: 8, // 2×4 area per chair (including legroom)
      aisleWidth: 4,
      description: "Wedding ceremony seating",
    },
    cocktail: {
      standingSpace: 6, // per person
      loungeFactor: 1.5, // extra space multiplier
      description: "Standing cocktail reception",
    },
  },

  buffetTypes: {
    "standard-8": {
      length: 8,
      width: 3,
      serviceArea: 24, // 8×3
      queueSpace: 100, // space for line
      description: "8ft standard buffet",
    },
    cloverleaf: {
      diameter: 5,
      serviceArea: 19.6, // πr²
      queueSpace: 80,
      description: '60" round cloverleaf',
    },
  },

  loungeItems: {
    sofa: {
      width: 6,
      depth: 2,
      clearance: 3, // space in front
      spaceRequired: 18, // 6×3
    },
  },

  barTypes: {
    "standard-8": {
      length: 8,
      depth: 4,
      serviceSpace: 32,
      queueSpace: 120,
    },
  },

  danceFloors: {
    small: { size: 12, space: 144 },
    medium: { size: 16, space: 256 },
    large: { size: 20, space: 400 },
    custom: { calculate: (guestCount: number) => Math.ceil(guestCount * 0.8) }, // 0.8 sqft per dancer
  },
}

export const calculateSpaceRequirements = (eventConfig: EventConfiguration): SpaceRequirements => {
  let totalArea = 0
  const components: SpaceComponent[] = []

  // 1. Calculate seating area
  const seatingStyle = SPACE_STANDARDS.seatingStyles[eventConfig.seatingStyle]

  if (eventConfig.seatingStyle === "cocktail") {
    totalArea = eventConfig.guestCount * seatingStyle.standingSpace
    if (eventConfig.hasStage) totalArea *= seatingStyle.loungeFactor
  } else if (eventConfig.seatingStyle === "ceremony") {
    totalArea = eventConfig.guestCount * seatingStyle.spacePerChair
    // Add ceremony space (10×10 minimum)
    totalArea += 100
  } else {
    const tablesNeeded = Math.ceil(eventConfig.guestCount / seatingStyle.chairsPerTable)
    totalArea = tablesNeeded * seatingStyle.spacePerTable

    // Add aisle space (assuming 1 main aisle)
    totalArea += Math.sqrt(totalArea) * seatingStyle.aisleWidth
  }

  components.push({
    type: "seating",
    area: totalArea,
    description: `${eventConfig.guestCount} guests (${seatingStyle.description})`,
  })

  // 2. Add buffet stations
  eventConfig.buffets.forEach((buffet) => {
    const buffetConfig = SPACE_STANDARDS.buffetTypes[buffet.type as keyof typeof SPACE_STANDARDS.buffetTypes]
    if (buffetConfig) {
      const buffetArea = buffetConfig.serviceArea + buffetConfig.queueSpace
      totalArea += buffetArea * buffet.quantity

      components.push({
        type: "buffet",
        area: buffetArea * buffet.quantity,
        description: `${buffet.quantity}× ${buffetConfig.description}`,
      })
    }
  })

  // 3. Add lounge areas
  eventConfig.loungeItems.forEach((item) => {
    const itemConfig = SPACE_STANDARDS.loungeItems[item.type as keyof typeof SPACE_STANDARDS.loungeItems]
    if (itemConfig) {
      const itemArea = itemConfig.spaceRequired * item.quantity
      totalArea += itemArea

      components.push({
        type: "lounge",
        area: itemArea,
        description: `${item.quantity}× ${item.type}`,
      })
    }
  })

  // 4. Add bars
  eventConfig.bars.forEach((bar) => {
    const barConfig = SPACE_STANDARDS.barTypes[bar.type as keyof typeof SPACE_STANDARDS.barTypes]
    if (barConfig) {
      const barArea = barConfig.serviceSpace + barConfig.queueSpace
      totalArea += barArea * bar.quantity

      components.push({
        type: "bar",
        area: barArea * bar.quantity,
        description: `${bar.quantity}× ${bar.type} bar`,
      })
    }
  })

  // 5. Add dance floor
  if (eventConfig.danceFloor) {
    let danceArea: number
    if (eventConfig.danceFloor === "custom") {
      danceArea = SPACE_STANDARDS.danceFloors.custom.calculate(eventConfig.guestCount)
    } else {
      const danceFloorConfig =
        SPACE_STANDARDS.danceFloors[eventConfig.danceFloor as keyof typeof SPACE_STANDARDS.danceFloors]
      danceArea = typeof danceFloorConfig === "object" && "space" in danceFloorConfig ? danceFloorConfig.space : 0
    }
    totalArea += danceArea

    components.push({
      type: "danceFloor",
      area: danceArea,
      description: `Dance floor (${eventConfig.danceFloor})`,
    })
  }

  // 6. Add stage if needed
  if (eventConfig.hasStage) {
    const stageArea = 200 // 10×20 stage
    totalArea += stageArea

    components.push({
      type: "stage",
      area: stageArea,
      description: "Performance stage",
    })
  }

  // 7. Add 15% circulation space
  const circulationSpace = totalArea * 0.15
  totalArea += circulationSpace

  components.push({
    type: "circulation",
    area: circulationSpace,
    description: "Aisles and walking space",
  })

  // Recommend tent sizes
  const recommendedTents = recommendTentSizes(totalArea)

  return {
    totalArea: Math.ceil(totalArea),
    components,
    recommendedTents,
    seatingStyle,
    guestCount: eventConfig.guestCount,
  }
}

const recommendTentSizes = (area: number) => {
  // Common tent sizes (width × length)
  const standardTents = [
    { size: "20×20", area: 400 },
    { size: "30×30", area: 900 },
    { size: "40×40", area: 1600 },
    { size: "20×40", area: 800 },
    { size: "30×60", area: 1800 },
    { size: "40×60", area: 2400 },
    { size: "50×80", area: 4000 },
    { size: "60×100", area: 6000 },
  ]

  // Find the smallest tent that fits
  const suitableTents = standardTents.filter((tent) => tent.area >= area)

  if (suitableTents.length > 0) {
    return suitableTents.sort((a, b) => a.area - b.area).slice(0, 3)
  }

  // If no standard tent fits, suggest custom size
  const minSide = Math.ceil(Math.sqrt(area))
  return [
    {
      size: `Custom (${minSide}×${minSide} minimum)`,
      area: minSide * minSide,
      custom: true,
    },
  ]
}
