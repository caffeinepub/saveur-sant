# Saveur Santé

## Current State
A bilingual (FR/EN) French cuisine diet planning website with:
- Hero section
- Meal plans section (6 plans with filters)
- Recipes section (12 recipes)
- About section
- AI nutrition chatbot (bottom-right)
- Language toggle (FR/EN) in header

## Requested Changes (Diff)

### Add
- A new "Personalized Diet Plan" section where users can input their height (cm) and weight (kg)
- BMI calculation based on height and weight
- A diet plan recommendation displayed after form submission, choosing from the existing meal plans based on BMI category (underweight, normal, overweight, obese)
- Bilingual labels and text for the new section (FR/EN)
- Unit toggle: metric (cm/kg) and imperial (ft+in/lbs)

### Modify
- App.tsx to include the new PersonalizedPlanSection component between HeroSection and MealPlansSection
- LanguageContext.tsx to add translation keys for the new section

### Remove
- Nothing removed

## Implementation Plan
1. Add translation keys for the new section to LanguageContext.tsx
2. Create PersonalizedPlanSection.tsx component with:
   - Height input (cm or ft/in)
   - Weight input (kg or lbs)
   - Unit toggle (metric/imperial)
   - Calculate BMI button
   - BMI result display with category label
   - Recommended diet plan card based on BMI category
3. Mount the new section in App.tsx between HeroSection and MealPlansSection
