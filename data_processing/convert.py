import rasterio

# Path to the TIFF file 
input_raster_path = 'data_processing/input_data/Granada_Surface_Temperature.tif'

# Open the raster file
with rasterio.open(input_raster_path) as src:
    # Read the first band (assuming your data is in the first band)
    band1 = src.read(1)
    print(band1)  # Prints the pixel values (temperature data)
