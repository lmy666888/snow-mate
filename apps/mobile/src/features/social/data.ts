import type { Rider } from "@snowmate/shared-types";
export const riders: Rider[] = [
  {
    id: "riley",
    name: "Riley",
    age: 26,
    level: "Intermediate",
    stance: "Goofy",
    resort: "Stowe Mountain",
    interests: ["Cruisy runs", "Fresh powder", "Après coffee"],
    bio: "Early lifts, long turns, and a coffee somewhere on the way down. Looking for a crew that enjoys the whole mountain.",
  },
  {
    id: "jordan",
    name: "Jordan",
    age: 28,
    level: "Advanced",
    stance: "Regular",
    resort: "Sugarbush",
    interests: ["Tree runs", "Freeride", "Weekend trips"],
    bio: "Always finding a new line. Happy to take it slow or chase a little fresh snow together.",
  },
  {
    id: "sam",
    name: "Sam",
    age: 25,
    level: "Beginner",
    stance: "Regular",
    resort: "Killington",
    interests: ["Learning turns", "Groomers", "Good company"],
    bio: "One turn better every weekend. Here for patient riding buddies and good mountain days.",
  },
];
export const images = {
  mountain: require("../../../assets/images/mountain.jpg"),
  rider: require("../../../assets/images/rider.jpg"),
  forest: require("../../../assets/images/forest.jpg"),
};
