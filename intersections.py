import json

import pandas as pd
from shapely.geometry import *

import geopandas as gpd


def create_gdf(df):
    geometry = [Point(xy) for xy in zip(df.lng, df.lat)]

    crs = {"init": "epsg:4326"}
    return gpd.GeoDataFrame(df, crs=crs, geometry=geometry)


def json_to_gdf(json):
    df = pd.DataFrame(json)
    df["lat"] = pd.to_numeric(df["lat"])
    df["lng"] = pd.to_numeric(df["lng"])

    return create_gdf(df)


if __name__ == '__main__':
    """
        # Steps 
        1. Read in the countries dataset without altering the content
        2. Read in the combined datasets, also without altering them
        3. They're broken into tsunamis, eruptions, and earthquakes
        4. set up a dictionary to hold the values and keep track of the points
        5. For each country, go through all the points to determine which ones lie within
        6. If a point is found, add it to the dictionary and don't try to find it again
        7. Keep a tally of how many points are found per country
        
    """

    point_tracker = dict()

    crs = {"init": "epsg:4326"}

    countries_gdf = gpd.read_file('custom.geo.json')

    column_names = {
        'earthquakes': 'earthquake_count',
        'eruptions': 'eruption_count',
        'tsunamis': 'tsunami_count'
    }

    countries_gdf['tsunami_count'] = 0
    countries_gdf['eruption_count'] = 0
    countries_gdf['earthquake_count'] = 0

    countries_gdf['ID'] = list(range(0, len(countries_gdf)))

    print(countries_gdf.columns)

    with open('d3_jsons/combined_points.json', 'r') as points_file:
        points_data = json.loads(points_file.read())

    combined_points = list()
    for group in points_data:
        for feature in group:
            feature['country_id'] = 999
            feature['country_name'] = ''

        combined_points.extend(group)

    for index, feature in enumerate(combined_points):
        feature['id'] = index

    points_dict = {index: Point(float(row['lng']), float(row['lat'])) for index, row in enumerate(combined_points)}

    print(len(points_dict) == len(combined_points))

    # tsunamis_gdf, eruptions_gdf, earthquakes_gdf = json_to_gdf(points_data[0]), json_to_gdf(points_data[1]), json_to_gdf(points_data[2])

    for index, country in countries_gdf.iterrows():

        country_poly = country.geometry
        country_name = country.name_long

        if not country_name:
            country_name = country.name

        print('\n{}'.format(country_name))

        for pt_index, row in enumerate(combined_points):
            point = points_dict.get(pt_index)

            assigned_point = point_tracker.get(pt_index)

            if not assigned_point:
                intersects = country_poly.intersects(point)

                if intersects:
                    row['country_id'] = country.ID
                    row['country_name'] = country_name

                    column_name = column_names[row['type']]

                    print(countries_gdf.at[index, column_name])

                    countries_gdf.at[index, column_name] = countries_gdf.at[index, column_name] + 1

                    print(countries_gdf.at[index, column_name])

    for key, val in point_tracker.items():
        row = combined_points[key]

        for k, v in val.items():
            row[k] = v

    tsunamis = list()
    earthquakes = list()
    eruptions = list()
    for inst in combined_points:
        if inst['type'] == 'tsunamis':
            tsunamis.append(inst)
        elif inst['type'] == 'earthquakes':
            earthquakes.append(inst)
        else:
            eruptions.append(inst)

    with open('d3_jsons/combined_points.json', 'w') as comb_file:
        comb_file.write(json.dumps([tsunamis, earthquakes, eruptions]))
        comb_file.close()

    with open('custom.geo.json', 'w') as custom_file:
        custom_file.write(countries_gdf.to_json())
        custom_file.close()




