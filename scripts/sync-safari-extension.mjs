import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const distDir = path.join(root, "dist");
const safariResourcesDir = path.join(
	root,
	"apps",
	"safari",
	"Onshape Plus",
	"Shared (Extension)",
	"Resources",
);

function assertExists(dir) {
	if (!fs.existsSync(dir)) {
		throw new Error(`Missing directory: ${dir}`);
	}
}

function copyDir(src, dest) {
	fs.mkdirSync(dest, { recursive: true });

	for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
		const srcPath = path.join(src, entry.name);
		const destPath = path.join(dest, entry.name);

		if (entry.isDirectory()) {
			copyDir(srcPath, destPath);
		} else {
			fs.copyFileSync(srcPath, destPath);
		}
	}
}

function emptyDir(dir) {
	if (!fs.existsSync(dir)) return;

	for (const entry of fs.readdirSync(dir)) {
		fs.rmSync(path.join(dir, entry), {
			recursive: true,
			force: true,
		});
	}
}

assertExists(distDir);
assertExists(safariResourcesDir);

emptyDir(safariResourcesDir);
copyDir(distDir, safariResourcesDir);

console.log("✅ Synced dist → Safari extension resources");
console.log(safariResourcesDir);
