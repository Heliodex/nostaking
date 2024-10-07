import { defineConfig, presetUno } from "unocss"
import transformerDirectives from "@unocss/transformer-directives"
import transformerVariantGroup from "@unocss/transformer-variant-group"

export default defineConfig({
	presets: [presetUno()],
	transformers: [transformerDirectives(), transformerVariantGroup()],
})
