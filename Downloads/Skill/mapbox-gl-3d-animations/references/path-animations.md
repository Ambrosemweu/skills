# Path Animations & Data-Driven Styling

## Path Animations

### Animated Line Drawing

```javascript
map.on('load', () => {
    const route = {
        type: 'Feature',
        geometry: {
            type: 'LineString',
            coordinates: [
                [-122.4194, 37.7749],
                [-122.4180, 37.7760],
                [-122.4160, 37.7780],
                [-122.4140, 37.7790]
            ]
        }
    };
    
    map.addSource('route', {
        type: 'geojson',
        data: {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: []
            }
        }
    });
    
    map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        paint: {
            'line-color': '#3887be',
            'line-width': 5,
            'line-opacity': 0.75
        }
    });
    
    let counter = 0;
    const coordinates = route.geometry.coordinates;
    
    function animateLine() {
        if (counter < coordinates.length) {
            map.getSource('route').setData({
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: coordinates.slice(0, counter + 1)
                }
            });
            counter++;
            requestAnimationFrame(animateLine);
        }
    }
    
    animateLine();
});
```

### Point Moving Along Path

```javascript
map.on('load', () => {
    const route = turf.lineString([
        [-122.4194, 37.7749],
        [-122.4180, 37.7760],
        [-122.4160, 37.7780],
        [-122.4140, 37.7790]
    ]);
    
    map.addSource('point', {
        type: 'geojson',
        data: {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: route.geometry.coordinates[0]
            }
        }
    });
    
    map.addLayer({
        id: 'point',
        type: 'circle',
        source: 'point',
        paint: {
            'circle-radius': 10,
            'circle-color': '#3887be'
        }
    });
    
    const lineLength = turf.length(route, { units: 'kilometers' });
    const duration = 5000;
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const distance = progress * lineLength;
        const point = turf.along(route, distance, { units: 'kilometers' });
        
        map.getSource('point').setData(point);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
});
```

---

## Data-Driven Styling

Use expressions for dynamic, data-based visualizations.

### Interpolate Expression

```javascript
// Color by value
{
    'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'value'],
        0, '#2DC4B2',
        25, '#3BB3C3',
        50, '#669EC4',
        75, '#8B88B6',
        100, '#A2719B'
    ]
}

// Size by zoom
{
    'circle-radius': [
        'interpolate',
        ['exponential', 1.5],
        ['zoom'],
        10, 2,
        15, 10,
        22, 180
    ]
}
```

### Step Expression

```javascript
{
    'circle-color': [
        'step',
        ['get', 'count'],
        '#51bbd6',  // Default
        100, '#f1f075',
        750, '#f28cb1'
    ]
}
```

### Match Expression

```javascript
{
    'fill-color': [
        'match',
        ['get', 'category'],
        'residential', '#e55e5e',
        'commercial', '#3bb2d0',
        'industrial', '#fbb03b',
        '#ccc' // Default
    ]
}
```
