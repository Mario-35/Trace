import { EConstant } from "../constant";

export function removeReturns(input: string) {
      return input.replace(/\r\n/g, EConstant.return)
        .split(EConstant.return)
        .map((e: string) => e.trim())
        .filter((e) => e.trim() != "")
        .join(" ");
    }