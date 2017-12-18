import json


class CaC(object):
    def __init__(self):
        self._files = [
            {'file_path': 'd3_jsons/tsunamis.json', 'type': 'tsunamis'},
            {'file_path': 'd3_jsons/eruptions.json', 'type': 'eruptions'},
            {'file_path': 'd3_jsons/earthquakes_original.json', 'type': 'earthquakes'}
        ]

    def categorize_on_type(self):
        data = list()
        for file in self._files:
            with open(file['file_path'], 'r') as f:
                file_data = json.loads(f.read())

                for entry in file_data['data']:
                    entry['type'] = file['type']

                data.append(file_data['data'])

            f.close()

        with open('d3_jsons/combined_points.json', 'w') as f:
            f.write(json.dumps(data))
            f.close()


if __name__ == '__main__':
    cac = CaC()
    cac.categorize_on_type()
