"use client";
import {useEffect} from "react";
import CalHeatmap from 'cal-heatmap';
// @ts-ignore
import Tooltip from 'cal-heatmap/plugins/Tooltip';
// @ts-ignore
import CalendarLabel from 'cal-heatmap/plugins/CalendarLabel';
// @ts-ignore
import Legend from 'cal-heatmap/plugins/Legend';

import 'cal-heatmap/cal-heatmap.css';

export default function Cal() {
    const data = [
        { date: '2023-01-01', value: 30 },
        { date: '2023-01-02', value: 60 },
      ];
  if (window !== undefined) {
    useEffect(() => {
    const cal = new CalHeatmap();
    cal.paint({ theme: 'light', 
    data: { source: 'https://my-api.com/weather-min-temp.json' },
              domain: {
                type: 'year',
                label: { text: null },
              },
              subDomain: { type: 'day', radius: 2 },
            }, [[Tooltip], [
                CalendarLabel,
                {
                  width: 30,
                  textAlign: 'start',
                  text: () => dayjs.weekDaysLong().map((d, i) => (i % 2 == 0 ? '' : d)),
                },
              ], [Legend, { position: 'bottom' }]]);
    // cal.paint({
    //     range: 1,
    //     date: { start: new Date(2020, 0, 1) },
    //   });
console.log('paint')
            }, []);
    // cal.paint(
    //     {
    //       domain: {
    //         type: 'year',
    //         label: { text: null },
    //       },
    //       subDomain: { type: 'day', radius: 2 },
    //     },
    //     // [[Tooltip]]
    //   );
  }

  return <div id="cal-heatmap"></div>;
}