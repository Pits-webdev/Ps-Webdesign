import GUI from "lil-gui"
import type * as THREE from "three"

export const debug = (material: THREE.ShaderMaterial) => {
	const gui = new GUI({ title: "DebugUi" })
	console.log(material.uniforms)

	const debugObject = {
		frequency: material.uniforms.uFrequency.value,
		amplitude: material.uniforms.uAmplitude.value,
		speed: material.uniforms.uSpeed.value,
		Rotation: material.uniforms.uRotation.value * (180 / Math.PI),
		colorBottom: `#${material.uniforms.uColorBottom.value.getHexString()}`,
		colorTop: `#${material.uniforms.uColorTop.value.getHexString()}`,
		
	}

	const planeFolder = gui.addFolder("Plane Ripple")

	planeFolder
		.add(debugObject,"Rotation")
		.min(0)
		.max(360)
		.step(1).name("Rotation Grad")
		.onChange((value: number) => {
            // Umrechnung: Grad -> Radians
            // Formel: wert * (PI / 180)
            material.uniforms.uRotation.value = value * (Math.PI / 180);
 		})

	planeFolder
		.add(debugObject, "frequency")
		.min(0)
		.max(10)
		.step(0.01)
		.name("Frequenz")
		.onChange((value: number) => {
			material.uniforms.uFrequency.value = value
		})

	planeFolder
		.add(debugObject, "amplitude")
		.min(0)
		.max(2)
		.step(0.01)
		.name("Höhe (Amp)")
		.onChange((value: number) => {
			material.uniforms.uAmplitude.value = value
		})

	planeFolder
		.add(debugObject, "speed")
		.min(0)
		.max(10)
		.step(0.1)
		.name("Speed")
		.onChange((value: number) => {
			material.uniforms.uSpeed.value = value
		})

	// 3. Ordner: Farben
	const colorFolder = gui.addFolder("Farben")

	colorFolder
		.addColor(debugObject, "colorTop")
		.name("Oben")
		.onChange((value: number) => {
			material.uniforms.uColorTop.value.set(value)
		})

		colorFolder
		.addColor(debugObject, "colorBottom")
		.name("Unten")
		.onChange((value: number) => {
			material.uniforms.uColorBottom.value.set(value)
		})

	// Optional: Start geschlossen
	gui.close()

	return gui
}
