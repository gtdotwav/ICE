export type FunnelType = "lp" | "checkout" | "lp_vsl_checkout"

export const BLOCKS_ORDER: Record<FunnelType, string[]> = {
  lp: ["hero", "benefits", "social_proof", "features", "faq", "cta"],
  checkout: ["summary", "price_table", "guarantee", "checkout_form", "security_badges"],
  lp_vsl_checkout: [
    "hero_vsl",
    "vsl_player",
    "problem_agitate_solve",
    "offer_stack",
    "bonuses",
    "testimonials",
    "price_table",
    "checkout_form",
    "faq",
  ],
}

export function getBlocksForType(type: FunnelType): string[] {
  return BLOCKS_ORDER[type]
}

export function stringifyBlocksJson(type: FunnelType): string {
  return JSON.stringify(BLOCKS_ORDER[type])
}
