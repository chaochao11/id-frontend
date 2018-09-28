export const WizardFooterChartsConfig = (data, time) => {
    return {
        grid: {
            top: '10%',
        },
        title: {
            text: `累计收益 %`,
            left: 0,
            top: 0,
            textStyle: {
                color: '#555',
                fontSize: 10
            }
        },
        tooltip: {
            trigger: "axis",
            backgroundColor: "rgba(150,150,150,0.7)",
            formatter: (params) => {
                const formatedArr = [params[0].axisValue].concat(
                    params.map((item) => {
                        return `<span style="color:${item.color}">${
                            item.seriesName
                            }: ${item.value.toFixed(4)}%</span>`;
                    }),
                );
                let formatedHtml = "";
                formatedArr.forEach((elm) => {
                    formatedHtml += `<span>${elm}</span><br/>`;
                });

                return formatedHtml;
            },
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: time
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%']
        },
        dataZoom: [{
            type: 'inside',
            start: 0,
            end: 100
        }, {
            start: 0,
            end: 100,
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
            },
            labelFormatter: ''
        }],
        series: [
            {
                name: data[0].name,
                type: 'line',
                smooth: true,
                symbol: 'none',
                sampling: 'average',
                itemStyle: {
                    normal: {
                        color: 'rgb(78, 114, 163)'
                    }
                },
                areaStyle: {
                    normal: {
                        color: 'rgb(228, 234, 241)'
                    }
                },
                data: data[0].data
            },
            {
                name: data[1].name,
                type: 'line',
                smooth: true,
                symbol: 'none',
                sampling: 'average',
                itemStyle: {
                    normal: {
                        color: 'rgb(158, 82, 79)'
                    }
                },
                areaStyle: {
                    normal: {
                        color: 'rgb(179, 139, 137)'
                    }
                },
                data: data[1].data
            }
        ]
    };
};

export const PortfolioChartsConfig = (info, grid, type) => {
    const {series, xaxis} = info;
    let dataY, name;
    if (series && xaxis) {
        dataY = series.data;
        name = series.name;
    }
    return {
        grid: {
            left: grid.left,
            top: grid.top,
            right: grid.right,
            bottom: grid.bottom,
        },
        tooltip: {
            trigger: "axis",
            // backgroundColor: "rgba(150,150,150,0.7)",
            formatter: '{b}<br/>{a0}&nbsp;{c0}'
        },
        xAxis: [
            {
                type: 'category',
                interval: 50, //每隔区域20
                show: type === 1 ? true : false,
                axisLabel: {
                    textStyle: {
                        color: '#aaaaaa'
                    },
                },
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false
                },
                data: xaxis
            }
        ],
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value}',
                show: true,
                textStyle: {
                    color: '#aaaaaa'
                },
            },
            splitLine: {
                lineStyle: {
                    // 使用深浅的间隔色
                    color: ['#e9e9e9']
                }
            },
            data: ["0.80", "0.84", "0.88", "0.92", "0.96", "1.0", '1.04', '1.08', '1.12', '1.16', '1.20'],
            axisLine: {
                show: false,
                lineStyle: {
                    color: '#e9e9e9'
                }
            },
            // splitNumber:10,
            boundaryGap: false,
            // min: 'dataMin',
            // max:'dataMax',
            position: 'right',
            // interval:0.04,
            // scale:true,
            min: function (value) {
                return value.min - 0.04;
            }
        },
        series: [
            {
                name: name,
                type: 'line',
                smooth: true,
                symbol: 'none',
                sampling: 'average',
                itemStyle: {
                    normal: {
                        color: '#9ac5ff'
                    }
                },
                areaStyle: {
                    normal: {
                        color: '#d8e9ff'
                    }
                },
                data: dataY
            },
        ]
    };
};

export const PieChartsConfig = (positions) => {
    const data = positions;
    return {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
            {
                name: '资产配置',
                type: 'pie',
                center: ['50%', '50%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                    },
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        areaStyle: {type: 'default'},
                        // color: function(params) {
                        //     let colorList = [
                        //         '#12345f', '#1e4c7c', '#3274b5', '#479ff8', '#73bff9'
                        //     ];
                        //     return colorList[params.dataIndex];
                        // }
                    }
                },
                data: data
            }
        ]
    };
};

//我要理财
export const FinancialCenterCharts = (series, xaxis) => {
    return {
        grid: {
            left: "10%",
            top: "10%",
            right: "15%",
            bottom: "20%"
        },
        tooltip: {
            trigger: "axis",
            // backgroundColor: "rgba(150,150,150,0.7)",
            formatter: '{b}<br/>{a0}&nbsp;{c0}'
        },
        xAxis: [
            {
                type: 'category',
                interval: 50, //每隔区域20
                axisLabel: {
                    textStyle: {
                        color: '#aaaaaa'
                    },
                },
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false
                },
                data: xaxis
            }
        ],
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value}',
                show: true,
                textStyle: {
                    color: '#aaaaaa'
                },
            },
            splitLine: {
                lineStyle: {
                    // 使用深浅的间隔色
                    color: ['#e9e9e9']
                }
            },
            data: ["0.80", "0.84", "0.88", "0.92", "0.96", "1.0", '1.04', '1.08', '1.12', '1.16', '1.20'],
            axisLine: {
                show: false,
                lineStyle: {
                    color: '#e9e9e9'
                }
            },
            // splitNumber:10,
            boundaryGap: false,
            // min: 'dataMin',
            // max:'dataMax',
            position: 'right',
            // interval:0.04,
            // scale:true,
            // min: function(value) {
            //     return value.min - 0.04;
            // }
        },
        series: [
            {
                name: name,
                type: 'line',
                smooth: true,
                symbol: 'none',
                sampling: 'average',
                itemStyle: {
                    normal: {
                        color: '#9ac5ff'
                    }
                },
                areaStyle: {
                    normal: {
                        color: '#d8e9ff'
                    }
                },
                data: series.data
            },
        ]
    };
};
//我要理财详情
export const FinancialDetailsCharts = (series, xaxis) => {
    return {
        grid: {
            left: "4%",
            top: "10%",
            right: "4%",
            bottom: "20%"
        },
        tooltip: {
            trigger: "axis",
            // backgroundColor: "rgba(150,150,150,0.7)",
            formatter: '{b}<br/>{a0}&nbsp;{c0}'
        },
        xAxis: [
            {
                type: 'category',
                interval: 50, //每隔区域20
                axisLabel: {
                    textStyle: {
                        color: '#aaaaaa'
                    },
                },
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false
                },
                data: xaxis
            }
        ],
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value}',
                show: true,
                textStyle: {
                    color: '#aaaaaa'
                },
            },
            splitLine: {
                lineStyle: {
                    // 使用深浅的间隔色
                    color: ['#e9e9e9']
                }
            },
            data: ["0.80", "0.84", "0.88", "0.92", "0.96", "1.0", '1.04', '1.08', '1.12', '1.16', '1.20'],
            axisLine: {
                show: false,
                lineStyle: {
                    color: '#e9e9e9'
                }
            },
            // splitNumber:10,
            boundaryGap: false,
            // min: 'dataMin',
            // max:'dataMax',
            position: 'right',
            // interval:0.04,
            // scale:true,
            // min: function(value) {
            //     return value.min - 0.04;
            // }
        },
        series: [
            {
                name: name,
                type: 'line',
                smooth: true,
                symbol: 'none',
                sampling: 'average',
                itemStyle: {
                    normal: {
                        color: '#9ac5ff'
                    }
                },
                areaStyle: {
                    normal: {
                        color: '#d8e9ff'
                    }
                },
                data: series.data
            },
        ]
    };
};