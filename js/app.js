(function (namespace) {
    /**
     * Builds base layer of the map.
     *
     * @return {Object}
     */
    function buildBaseLayer() {
        return L.tileLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            className: 'base-map-tile',
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
        });
    }


    /**
     * Build legend control.
     *
     * @param {String} description
     * @param {Array} grades
     * @return {Object}
     */
    function buildLegend(description, grades) {
        const legend = L.control({position: 'bottomright'});

        legend.onAdd = () => {
            const div = L.DomUtil.create('div', 'info legend');

            div.innerHTML += `<p>${description}</p>`;

            grades.forEach((grade) => {
                div.innerHTML +=
                    `<i style="background: ${grade.color}"></i> <span>${grade.label}</span><br/>`;
            })

            return div;
        }

        return legend;
    }

    /**
     * Build visited data layer.
     *
     * @return {{legend: *, name: string, layer: *}}
     */
    function buildVisitedDataLayer() {
        return {
            name: 'Наведаныя рэгіёны',
            layer: L.tileLayer('./tiles/visited/{z}/{x}/{y}.png', {
                minZoom: 6,
                maxZoom: 13,
                bounds: [[51.083107, 23.411576], [56.293815, 33.712001]]
            }),
            legend: buildLegend(
                'Наведаныя рэгіёны',
                [
                    {color: 'gray', label: 'нікога'},
                    {color: 'orange', label: '1 падарожнік'},
                    {color: 'green', label: '>1 падарожніка'},
                ]
            )
        }
    }

    /**
     * Build heat data layer.
     *
     * @return {{legend: *, name: string, layer: *}}
     */
    function buildHeatDataLayer() {
        return {
            name: 'Наведаныя рэгіёны па папулярнасці',
            layer: L.tileLayer('./tiles/heat/{z}/{x}/{y}.png', {
                minZoom: 6,
                maxZoom: 13,
                bounds: [[51.083107, 23.411576], [56.293815, 33.712001]]
            }),
            legend: buildLegend(
                'Наведанныя рэгіёны па папулярнасці',
                [
                    {color: 'gray', label: 'нікога'},
                    {color: 'red', label: '1 падарожнік'},
                    {color: 'orange', label: '1-3 падарожнікаў'},
                    {color: 'yellow', label: '3-10 падарожнікаў'},
                    {color: 'green', label: '10-30 падарожнікаў'},
                    {color: 'aqua', label: '30-50 падарожнікаў'},
                    {color: 'blue', label: '50-100 падарожнікаў'},
                    {color: 'violet', label: '100-200 падарожнікаў'},
                    {color: 'indigo', label: '200+ падарожнікаў'},
                ]
            )
        }
    }

    /**
     * Build pop data layer.
     *
     * @return {{legend: *, name: string, layer: *}}
     */
    function buildPopDataLayer() {
        return {
            name: 'Самыя папулярныя рэгіёны',
            layer: L.tileLayer('./tiles/popular/{z}/{x}/{y}.png', {
                minZoom: 6,
                maxZoom: 13,
                bounds: [[51.083107, 23.411576], [56.293815, 33.712001]]
            }),
            legend: buildLegend(
                'Самыя папулярныя рэгіёны',
                [
                    {color: 'red', label: '30+ падарожнікаў'},
                ]
            )
        }
    }

    /**
     * Builds data layers.
     *
     * @return {Array}
     */
    function buildDataLayers() {
        return [
            buildVisitedDataLayer(),
            buildHeatDataLayer(),
            buildPopDataLayer(),
        ];
    }

    /**
     * Init layers control.
     *
     * @param {Object} map
     * @param {Array} overlays
     */
    function initLayersControl(map, overlays) {
        const overlayByTitles = {};

        overlays.forEach(overlay => {
            overlayByTitles[overlay.name] = overlay.layer;
        });

        L.control.layers(overlayByTitles).addTo(map);
    }

    /**
     * Show layer legend.
     *
     * @param {Object} map
     * @param {Object} activeOverlay
     * @param {Array} overlays
     */
    function showLayerLegend(map, activeOverlay, overlays) {
        overlays.forEach((overlay) => {
            if (overlay.name !== activeOverlay.name) {
                map.removeControl(overlay.legend);
            }
        })

        activeOverlay.legend.addTo(map);
    }

    /**
     * Init map.
     *
     * @param {String} containerId
     * @return {Object}
     */
    function init(containerId) {
        const map = L.map(containerId, {
            zoom: 7,
            center: [53.893009, 27.567444]
        });

        const overlays = buildDataLayers();

        buildBaseLayer().addTo(map);
        initLayersControl(map, overlays);

        map.on('baselayerchange', function (event) {
            showLayerLegend(
                map,
                overlays.find(overlay => overlay.name === event.name),
                overlays
            );
        });

        const defaultOverlay = overlays[0];
        defaultOverlay.layer.addTo(map);
        defaultOverlay.legend.addTo(map);

        return map;
    }

    namespace.initMap = init;
})(window);
