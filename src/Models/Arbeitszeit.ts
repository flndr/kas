import { Wochentag } from "Models/Enum/Wochentag"

export type Arbeitszeit = { [key in Wochentag] : number };
