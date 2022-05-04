import { Wochentag } from "Models/Wochentag"

export type Arbeitszeiten = { [key in Wochentag] : number };
