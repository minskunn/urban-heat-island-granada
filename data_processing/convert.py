import rasterio
import numpy as np
import geopandas as gpd
from shapely.geometry import Point

# Open the raster file
with rasterio.open("data_processing/input_data/Granada_Surface_Temperature.tif") as src:
    # Read the temperature data into a NumPy array
    temperature_data = src.read(1)  
    
    # Get the metadata 
    transform = src.transform
    crs = src.crs  

# Define new block size 
block_size = 4

# Reshape the array to 4x4 pixel blocks 
reshaped_data = temperature_data.reshape(-1, block_size, block_size)

# Calculate the mean temperature for each 120m x 120m block (averaging the pixels in each block)
mean_temperatures = reshaped_data.mean(axis=(1, 2))  # Mean across rows and columns of each block

# Calculate the center of each 120m x 120m block
block_centers = []
for i in range(mean_temperatures.shape[0]):
    # Get the x, y coordinates of the center of each block
    row = i // (temperature_data.shape[1] // block_size)
    col = i % (temperature_data.shape[1] // block_size)
    
    # Calculate the x, y coordinates of the block center
    x_center, y_center = rasterio.transform.xy(transform, row * block_size + block_size // 2, col * block_size + block_size // 2)
    
    block_centers.append((x_center, y_center))

# Convert the list of centers into a list of Point geometries
points = [Point(x, y) for x, y in block_centers]

# Create a GeoDataFrame from the points
gdf = gpd.GeoDataFrame(
    geometry=points,
    crs=crs  # Use the original CRS from the raster file
)

# Add the mean temperature values as a new column
gdf['temperature'] = mean_temperatures


# Save the GeoDataFrame to a GeoJSON file
gdf.to_file("data_processing/output_data/temperature_points.geojson", driver="GeoJSON")



