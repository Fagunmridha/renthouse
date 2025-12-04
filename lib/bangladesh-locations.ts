
interface Upazila {
  name: string
  lat: number
  lng: number
}

interface District {
  name: string
  upazilas: Upazila[]
}

interface Division {
  name: string
  districts: District[]
}

interface BangladeshLocations {
  divisions: Division[]
}

let cachedLocations: BangladeshLocations | null = null
let cachedLocationList: string[] | null = null


export async function loadBangladeshLocations(): Promise<BangladeshLocations> {
  if (cachedLocations) {
    return cachedLocations
  }

  try {
    const response = await fetch("/data/bangladesh-locations.json")
    if (!response.ok) {
      throw new Error("Failed to fetch locations")
    }
    const data = await response.json()
    cachedLocations = data
    return data
  } catch (error) {
    console.error("Error loading Bangladesh locations:", error)
    return { divisions: [] }
  }
}


export async function getAllBangladeshLocations(): Promise<string[]> {
  if (cachedLocationList) {
    return cachedLocationList
  }

  const locations = await loadBangladeshLocations()
  const locationList: string[] = []

  locations.divisions.forEach((division) => {
    division.districts.forEach((district) => {
      district.upazilas.forEach((upazila) => {
        locationList.push(`${division.name}, ${district.name}, ${upazila.name}`)
      })
    })
  })

  cachedLocationList = locationList
  return locationList
}


export async function getSimpleBangladeshLocations(): Promise<string[]> {
  const locations = await loadBangladeshLocations()
  const locationList: string[] = []

  locations.divisions.forEach((division) => {
    division.districts.forEach((district) => {
      district.upazilas.forEach((upazila) => {
        locationList.push(upazila.name)
      })
    })
  })

  return locationList
}


export async function getLocationsByDivision(): Promise<Record<string, string[]>> {
  const locations = await loadBangladeshLocations()
  const grouped: Record<string, string[]> = {}

  locations.divisions.forEach((division) => {
    grouped[division.name] = []
    division.districts.forEach((district) => {
      district.upazilas.forEach((upazila) => {
        grouped[division.name].push(`${district.name}, ${upazila.name}`)
      })
    })
  })

  return grouped
}


export async function getAllDistricts(): Promise<string[]> {
  const locations = await loadBangladeshLocations()
  const districtsSet = new Set<string>()

  locations.divisions.forEach((division) => {
    division.districts.forEach((district) => {
      districtsSet.add(district.name)
    })
  })

  return Array.from(districtsSet).sort()
}


export async function getUpazilasByDistrict(districtName: string): Promise<Upazila[]> {
  const locations = await loadBangladeshLocations()
  const upazilas: Upazila[] = []

  locations.divisions.forEach((division) => {
    division.districts.forEach((district) => {
      if (district.name === districtName) {
        upazilas.push(...district.upazilas)
      }
    })
  })

  return upazilas
}


export async function getDistrictInfo(districtName: string): Promise<{
  division: string
  district: District
} | null> {
  const locations = await loadBangladeshLocations()

  for (const division of locations.divisions) {
    const district = division.districts.find((d) => d.name === districtName)
    if (district) {
      return {
        division: division.name,
        district,
      }
    }
  }

  return null
}

