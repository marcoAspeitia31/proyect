const charts = {
  earningChart: {
    series: [
      {
        name: "Desktops",
        data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35],
      },
      {
        name: "Desktops2",
        data: [87, 57, 74, 99, 75, 38, 62, 47, 82, 56, 45, 47],
      },
    ],
    chartOptions: {
      chart: {
        toolbar: {
          show: false,
        },
        height: 320,
      },
      legend: {
        show: false,
      },
      colors: ["#e22454", "#2483e2"],
      markers: {
        size: 1,
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "oct",
          "nov",
          "dec",
        ],
      },
      responsive: [
        {
          breakpoint: 1400,
          options: {
            chart: {
              height: 300,
            },
          },
        },
        {
          breakpoint: 992,
          options: {
            chart: {
              height: 210,
              width: "100%",
              offsetX: 0,
            },
          },
        },
        {
          breakpoint: 578,
          options: {
            chart: {
              height: 200,
              width: "105%",
              offsetX: -20,
              offsetY: 10,
            },
          },
        },
        {
          breakpoint: 430,
          options: {
            chart: {
              width: "108%",
            },
          },
        },
        {
          breakpoint: 330,
          options: {
            chart: {
              width: "112%",
            },
          },
        },
      ],
    },
  },
  revenueChart: {
    series: [
      {
        name: "Actual",
        data: [
          {
            x: "2011",
            y: 1292,
          },
          {
            x: "2012",
            y: 4432,
          },
          {
            x: "2013",
            y: 5423,
          },
          {
            x: "2014",
            y: 6653,
          },
          {
            x: "2015",
            y: 8133,
          },
          {
            x: "2016",
            y: 7132,
          },
          {
            x: "2017",
            y: 7332,
          },
          {
            x: "2018",
            y: 6553,
          },
        ],
      },
    ],
    chartOptions: {
      chart: {
        height: 320,
        type: "bar",
      },
      plotOptions: {
        bar: {
          columnWidth: "40%",
        },
      },
      colors: ["#e22454"],
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
    },
  },

  visitorChart: {
    series: [44, 55, 41, 17],
    chartOptions: {
      labels: [
        "The Passersby",
        "The Occasionals",
        "The Regulars",
        "The Superfans",
      ],
      chart: {
        width: "100%",
        // height: 275,
        type: "donut",
      },
      legend: {
        fontSize: "12px",
        position: "bottom",
        offsetX: 1,
        offsetY: -1,
        markers: {
          width: 10,
          height: 10,
        },
        itemMargin: {
          vertical: 2,
        },
      },
      colors: ["#4aa4d9", "#ef3f3e", "#9e65c2", "#6670bd", "#FF9800"],
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 270,
        },
      },
      dataLabels: {
        enabled: false,
      },
      responsive: [
        {
          breakpoint: 1835,
          options: {
            // chart: {
            //   height: 245,
            // },
            legend: {
              position: "bottom",
              itemMargin: {
                horizontal: 5,
                vertical: 1,
              },
            },
          },
        },
        {
          breakpoint: 1388,
          options: {
            chart: {
              height: 330,
            },
            legend: {
              position: "bottom",
            },
          },
        },
        {
          breakpoint: 1275,
          options: {
            chart: {
              height: 300,
            },
            legend: {
              position: "bottom",
            },
          },
        },
        {
          breakpoint: 1158,
          options: {
            chart: {
              height: 280,
            },
            legend: {
              fontSize: "10px",
              position: "bottom",
              offsetY: 10,
            },
          },
        },
        {
          theme: {
            mode: "dark",
            palette: "palette1",
            monochrome: {
              enabled: true,
              color: "#255aee",
              shadeTo: "dark",
              shadeIntensity: 0.65,
            },
          },
        },
        {
          breakpoint: 598,
          options: {
            chart: {
              height: 280,
            },
            legend: {
              fontSize: "12px",
              position: "bottom",
              offsetX: 5,
              offsetY: -5,
              markers: {
                width: 10,
                height: 10,
              },
              itemMargin: {
                vertical: 1,
              },
            },
          },
        },
      ],
    },
  },

  salesSummary: {
    series: [
      {
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
      },
      {
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
      },
      {
        data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
      },
    ],

    chartOptions: {
      chart: {
        type: "bar",
        height: 290,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
          borderRadius: 9,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      colors: ["#e22454", "#2483e2", "#3d3d3d"],
      xaxis: {
        categories: [
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
        ],
      },
      yaxis: {
        title: {
          show: false,
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val + " thousands";
          },
        },
      },
      legend: {
        show: false,
      },
      responsive: [
        {
          breakpoint: 991,

          options: {
            chart: {
              height: 300,
            },
          },
        },
      ],
    },
  },

  employessSatisfiedChart: {
    series: [
      {
        name: "Sales",
        data: [4, 3, 10, 9, 29, 19, 22, 9, 12, 7, 19],
      },
    ],
    chartOptions: {
      colors: ["#e22454"],

      chart: {
        type: "area",
        // stacked: false,
        height: 285,
      },
      dataLabels: {
        enabled: false,
      },

      stroke: {
        width: 3,
        curve: "smooth",
      },
    },
  },
  expensesChart: {
    series: [
      {
        name: "Page Views",
        data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10],
      },
    ],
    chartOptions: {
      theme: {
        monochrome: {
          enabled: true,
          color: "#255aee",
          shadeTo: "light",
          shadeIntensity: 0.65,
        },
      },
      chart: {
        height: 310,
        type: "line",
        zoom: {
          enabled: true,
        },
      },
      stroke: {
        width: [3, 7, 5],
        curve: "straight",
        dashArray: [0, 8, 5],
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6,
        },
      },
      xaxis: {
        categories: [
          "01",
          "02",
          "03",
          "04",
          "05",
          "06",
          "07",
          "08",
          "09",
          "10",
          "11",
          "12",
        ],
      },
      grid: {
        borderColor: "#ddd",
      },
      responsive: [
        {
          breakpoint: 992,
          options: {
            chart: {
              height: 300,
            },
          },
        },
      ],
    },
  },
  salePurchaseChart: {
    series: [
      {
        data: [21, 22, 10, 28, 16, 21, 13, 30, 12, 20],
      },
    ],
    chartOptions: {
      chart: {
        height: 300,
        type: "bar",
      },
      colors: ["#e22454", "#2483e2", "#3d3d3d"],
      plotOptions: {
        bar: {
          columnWidth: "45%",
          distributed: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      xaxis: {
        categories: [
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
        ],
        labels: {
          style: {
            colors: ["#e22454", "#2483e2", "#3d3d3d"],
            fontSize: "12px",
          },
        },
      },
    },
  },
  salePurchaseReturnChart: {
    series: [
      {
        // name: 'series1',
        data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
      },
      {
        // name: 'series2',
        data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
      },
    ],
    chartOptions: {
      chart: {
        height: 350,
        type: "area",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
        width: [3, 3],
      },

      colors: ["#e22454", "#2483e2", "#e2c924"],

      xaxis: {
        type: "time",
        categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      },

      legend: {
        show: false,
      },

      tooltip: {
        show: false,
      },
    },
  },
};

export default charts;
