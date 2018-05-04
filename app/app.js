window.viewer = new Potree.Viewer(
    document.getElementById('potree_render_area')
);

viewer.setEDLEnabled(true);
viewer.setFOV(60);
viewer.setPointBudget(6 * 1000 * 1000);
viewer.loadSettingsFromURL();
viewer.setBackground('skybox');
viewer.setDescription('');

viewer.loadGUI(() => {
    viewer.setLanguage('en');
    $('#menu_appearance')
        .next()
        .show();
    //viewer.toggleSidebar();
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
