import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { build, defineConfig } from "vite";

function buildPageBridge() {
	return {
		name: "build-page-bridge",
		closeBundle: async () => {
			await build({
				configFile: false,
				resolve: {
					alias: {
						"@": path.resolve(__dirname, "./src"),
					},
				},
				build: {
					outDir: "dist",
					emptyOutDir: false,
					lib: {
						entry: "src/bridge/onshape-page-bridge.ts",
						name: "OnshapePageBridge",
						formats: ["iife"],
						fileName: () => "onshape-page-bridge.js",
					},
					rollupOptions: {
						output: {
							codeSplitting: false,
						},
					},
				},
			});
		},
	};
}

export default defineConfig({
	plugins: [react(), tailwindcss(), buildPageBridge()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		outDir: "dist",
		emptyOutDir: true,
		rollupOptions: {
			input: {
				main: "src/main.tsx",
			},
			output: {
				entryFileNames: "assets/[name].js",
				chunkFileNames: "assets/[name].js",
				assetFileNames: "assets/[name][extname]",
			},
		},
	},
});
