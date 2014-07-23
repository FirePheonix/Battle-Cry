var assets = {
	fireBall : function(x, y, z, size) {
		geometry = new THREE.SphereGeometry(150, 100, 100);
		material = new THREE.MeshNormalMaterial({shading: THREE.FlatShading});
		mesh = new THREE.Mesh(geometry, material);
		mesh.position.x = x;
		mesh.position.y = y;
		mesh.position.z = z;
		mesh.scale.x = mesh.scale.y = mesh.scale.z = size;
		mesh.vertices[0].position.y = 10;
	}	
}



	
