import { EConstant } from "../constant"

export function removeReturns(input: string): string {
  return input
    .replace(/\r\n/g, EConstant.return)
    .split(EConstant.return)
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" ")
}
