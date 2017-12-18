from dateutil.parser import parse
import os
import json


class CreateTimeColumn(object):
    def __init__(self):
        self._files = ['d3_jsons/tsunamis.json', 'd3_jsons/eruptions.json', 'd3_jsons/earthquakes_original.json']
        self._time_set = set()

    def convert_the_times(self):
        cleaned_files = list()

        for file in self._files:
            file_data = self._read_file(file_path=file)

            cleaned_file_data = self._clean_time_columns(file_data)
            cleaned_files.append(cleaned_file_data)

        self._time_set = list(self._time_set)
        self._time_set.sort()

        ordered_times = {time: ind for ind, time in enumerate(self._time_set)}

        for ind, ds in enumerate(cleaned_files):
            timed_data = self._assign_t_value(ordered_times, ds)

            self._update_file(file_path=self._files[ind], dataset=timed_data)

        with open('d3_jsons/times.json', 'w') as f:
            f.write(json.dumps(list(ordered_times.values())))

    def _update_file(self, file_path, dataset):
        with open(file_path, 'w') as f:
            f.write(json.dumps(dict(data=dataset)))
            f.close()

    def _assign_t_value(self, ordered_times, file_data):
        for row in file_data:
            full_time = row['full_time']
            if full_time:
                row['t'] = ordered_times[full_time]
            else:
                row['t'] = len(ordered_times)

            del row['full_time']

        return file_data

    def _clean_time_columns(self, file_data):
        for ind, row in enumerate(file_data):
            row_lowered = {key.lower(): row[key] for key in row.keys()}

            year = row_lowered.get('year')
            month = row_lowered.get('month')
            day = row_lowered.get('day')

            try:
                if any([(not all([year, month, day])), ('-' in str(year)), (int(year) < 1900)]):
                    row['full_time'] = 0
                    continue
            except:
                print('hello')

            time = parse('{}/{}/{}'.format(month, day, year))

            row['full_time'] = time
            self._time_set.add(time)

        return file_data

    def _read_file(self, file_path):
        with open(file_path, 'r') as f:
            file_data = json.loads(f.read())

        f.close()
        return file_data['data']


class Something(CreateTimeColumn):
    def __init__(self):
        super(Something, self).__init__()

        


if __name__ == '__main__':
    time_column = CreateTimeColumn()
    time_column.convert_the_times()




