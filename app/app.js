window.viewer = new Potree.Viewer(
    document.getElementById('potree_render_area')
);

viewer.setEDLEnabled(false);
viewer.setFOV(60);
viewer.setPointBudget(6 * 1000 * 1000);
viewer.loadSettingsFromURL();
viewer.setBackground('skybox');
viewer.setDescription('');

viewer.loadGUI(() => {
    viewer.setLanguage('en');
    $('#menu_scene')
        .next()
        .show();
    viewer.toggleSidebar();
});

Potree.loadPointCloud(
    'greyhound://geo.labs.vu.nl:8080/resource/driekamers/',
    'driekamers',
    function(e) {
        viewer.scene.addPointCloud(e.pointcloud);

        const material = e.pointcloud.material;
        material.pointColorType = Potree.PointColorType.INTENSITY;
        $('#optMaterial0').val('Intensity');
        $('#optMaterial0').selectmenu('refresh');
        material.size = 0.65;
        material.pointSizeType = Potree.PointSizeType.ADAPTIVE;
        material.intensityRange = [42000, 65535];

        viewer.scene.view.position.set(
            177.10138131529018,
            10.946212482643327,
            -109.16624407603351
        );
        viewer.scene.view.yaw = 11.8;
        viewer.scene.view.pitch = 0;

        viewer.setNavigationMode(Potree.FirstPersonControls);
        viewer.fpControls.lockElevation = true;
        viewer.setMoveSpeed(1);
    }
);

const loadingManager = new THREE.LoadingManager();
const loader = new THREE.ColladaLoader(loadingManager);

const photos = [];
for (let i = 1; i < 7; i++) {
    const name = 'foto_0' + i;
    loader.load('../data/' + name + '.dae', function(collada) {
        collada.library.materials;
        for (const materialObject in collada.library.materials) {
            if (collada.library.materials.hasOwnProperty(materialObject)) {
                const material = collada.library.materials[materialObject];
                material.build.shininess = 0;
            }
        }
        const model = collada.scene;
        model.rotation.set(0, 0, 0);

        viewer.scene.scene.add(model);
        photos.push(model);

        viewer.onGUILoaded(() => {
            const tree = $(`#jstree_scene`);

            let photoID = tree.jstree(
                'create_node',
                'other',
                {
                    text: name,
                    icon: `${Potree.resourcePath}/icons/triangle.svg`,
                    data: model
                },
                'last',
                false,
                false
            );
            tree.jstree(model.visible ? 'check_node' : 'uncheck_node', photoID);
        });
    });
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

document.addEventListener('mousedown', onDocumentMouseDown, false);
document.addEventListener('touchstart', onDocumentTouchStart, false);

function onDocumentTouchStart(event) {
    event.preventDefault();

    event.clientX = event.touches[0].clientX;
    event.clientY = event.touches[0].clientY;
    onDocumentMouseDown(event);
}

function onDocumentMouseDown(event) {
    event.preventDefault();
    const canvasPosition = viewer.renderer.domElement.getBoundingClientRect();

    mouse.x =
        (event.clientX - canvasPosition.left) /
            viewer.renderer.domElement.clientWidth *
            2 -
        1;
    mouse.y =
        -(
            (event.clientY - canvasPosition.top) /
            viewer.renderer.domElement.clientHeight
        ) *
            2 +
        1;

    raycaster.setFromCamera(mouse, viewer.scene.getActiveCamera());

    const intersects = raycaster.intersectObjects(photos, true);

    if (intersects.length > 0) {
        $('#photoInfo').css('visibility', 'visible');
        $('#photoTitle').text(intersects[0].object.name);
        // $('#photoText').text();
    } else {
        $('#photoInfo').css('visibility', 'hidden');
    }
}
