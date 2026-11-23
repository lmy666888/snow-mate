import React from "react";
import {
  AppCard,
  AppText,
  ChoiceGroup,
  PageHeader,
  PrototypeNote,
  ScreenContainer,
} from "../../components/ui";
import { useSocial } from "../../stores/social";
import { cities, countries, type Country } from "./model";
export function RegionScreen() {
  const { region, setRegion } = useSocial();
  return (
    <ScreenContainer>
      <PageHeader
        back
        title="Your corner of the mountain."
        subtitle="Manual region · no GPS permission"
      />
      <ChoiceGroup
        label="Country"
        options={countries}
        value={region.country}
        onChange={(country) =>
          setRegion({
            country: country as Country,
            city: cities[country as Country][0],
          })
        }
      />
      <ChoiceGroup
        label="City"
        options={cities[region.country]}
        value={region.city}
        onChange={(city) => setRegion({ city })}
      />
      <ChoiceGroup
        label="Preferred discovery region"
        options={["all", ...countries]}
        value={region.discovery}
        onChange={(discovery) =>
          setRegion({ discovery: discovery as Country | "all" })
        }
      />
      <ChoiceGroup
        label="Maximum travel distance"
        options={["100", "500", "2000", "20000"]}
        value={String(region.maxDistanceKm)}
        onChange={(value) => setRegion({ maxDistanceKm: Number(value) })}
      />
      <PrototypeNote>
        Distances above are in kilometers. Discovery uses approximate
        city-center distance, never your precise location.
      </PrototypeNote>
      <ChoiceGroup
        label="Distance units"
        options={["km", "mi"]}
        value={region.distanceUnit}
        onChange={(distanceUnit) =>
          setRegion({ distanceUnit: distanceUnit as "km" | "mi" })
        }
      />
      <ChoiceGroup
        label="Temperature units"
        options={["C", "F"]}
        value={region.temperatureUnit}
        onChange={(temperatureUnit) =>
          setRegion({ temperatureUnit: temperatureUnit as "C" | "F" })
        }
      />
      <ChoiceGroup
        label="Display currency"
        options={["USD", "CAD", "CNY"]}
        value={region.currency}
        onChange={(currency) =>
          setRegion({ currency: currency as "USD" | "CAD" | "CNY" })
        }
      />
      <AppCard>
        <AppText>
          Language, region, units and currency are independent preferences.
        </AppText>
        <PrototypeNote>
          Display currency applies to locally entered budgets. Existing
          fictional ticket offers remain explicitly priced in USD; there is no
          exchange-rate service or automatic conversion.
        </PrototypeNote>
      </AppCard>
    </ScreenContainer>
  );
}
