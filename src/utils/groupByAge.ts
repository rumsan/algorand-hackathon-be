import { ageRanges } from "src/constants/ageRange";

export const  groupByAge = (beneficiaries: { age: number }[]) => {
    const ageGroups = ageRanges.reduce(
      (acc, range) => {
        acc[range.label] = 0;
        return acc;
      },
      {} as { [key: string]: number },
    );

    beneficiaries.forEach(({ age }) => {
      const range = ageRanges.find(
        (range) => age >= range.min && age <= range.max,
      );
      if (range) {
        ageGroups[range.label]++;
      }
    });

    return ageGroups;
  }