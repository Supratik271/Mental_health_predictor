import { z } from "zod";

// Mirrors the Pydantic `StudentData` model in main.py exactly.
export const GENDERS = ["Male", "Female", "Other"] as const;
export const ACADEMIC_LEVELS = ["High School", "Undergraduate", "Graduate"] as const;
export const PLATFORMS = [
  "Facebook", "LinkedIn", "Instagram", "Snapchat", "Twitter", "YouTube",
  "TikTok", "LINE", "KakaoTalk", "VKontakte", "WhatsApp", "WeChat",
] as const;
export const PURPOSES = ["Networking", "Entertainment", "Education", "News"] as const;
export const STRESS_LEVELS = ["Low", "Medium", "High", "Very High"] as const;
// Countries the backend keeps as-is; anything else is grouped as "Other" server-side.
export const KNOWN_COUNTRIES = ["India", "USA", "Canada", "Australia", "UK", "Germany", "Mexico", "Turkey", "France", "Other"];

const pick = <T extends readonly [string, ...string[]]>(values: T) =>
  z.enum(values, { errorMap: () => ({ message: "Please select an option" }) });

const hours = (max = 24) =>
  z
    .number({ invalid_type_error: "Enter a number", required_error: "Required" })
    .min(0, "Must be 0 or more")
    .max(max, `Must be ${max} or less`);

export const studentSchema = z.object({
  Age: z
    .number({ invalid_type_error: "Enter a whole number", required_error: "Required" })
    .int("Must be a whole number")
    .min(0, "Must be 0 or more")
    .max(120, "Must be 120 or less"),
  Gender: pick(GENDERS),
  Country: z.string().trim().min(1, "Country is required"),
  Academic_Level: pick(ACADEMIC_LEVELS),
  Most_Used_Platform: pick(PLATFORMS),
  Purpose_Of_Use: pick(PURPOSES),
  Avg_Daily_Usage_Hours: hours(),
  Daily_Unlocks: z
    .number({ invalid_type_error: "Enter a whole number", required_error: "Required" })
    .int("Must be a whole number")
    .min(0, "Must be 0 or more"),
  Study_Hours: hours(),
  Physical_Activity_Hours: hours(),
  Sleep_Hours_Per_Night: hours(),
  Stress_Level: pick(STRESS_LEVELS),
});

export type StudentData = z.infer<typeof studentSchema>;

export const FIELD_LABELS: Record<keyof StudentData, string> = {
  Age: "Age",
  Gender: "Gender",
  Country: "Country",
  Academic_Level: "Academic level",
  Most_Used_Platform: "Most used platform",
  Purpose_Of_Use: "Purpose of use",
  Avg_Daily_Usage_Hours: "Daily social media (hrs)",
  Daily_Unlocks: "Daily phone unlocks",
  Study_Hours: "Study hours / day",
  Physical_Activity_Hours: "Physical activity (hrs/day)",
  Sleep_Hours_Per_Night: "Sleep (hrs/night)",
  Stress_Level: "Stress level",
};
