define([
    'jquery',
    'underscore',
    'backbone',
    './Generic',
    'EpoAuth',
    '../../../libs/d3',
    'text!../templates/stats/bubble_template.html'
], function (
    $, 
    _, 
    Backbone, 
    GenericView,
    EpoAuth,
    d3,
    bubbleTemplate
){

    Date.prototype.addDays = function(days) {
       var dat = new Date(this.valueOf())
       dat.setDate(dat.getDate() + days);
       return dat;
    }

    function getDates(startDate, stopDate) {
        var dateArray = new Array();
        var currentDate = startDate;
        while (currentDate <= stopDate) {
        dateArray.push(currentDate)
        currentDate = currentDate.addDays(1);
        }
        return dateArray;
    }

    return GenericView.extend({

        el: $('.stats-content-wrap'),
        body: '.chart',
        viewButton: '#profile-statistics-tab',

        bubbleTemplate: _.template(bubbleTemplate),

        getData: function(cb) {
            EpoAuth.apiRequest('get', this.controller.apiData.endpoints.notes.stats, null, function (data) {
                this.data = data;
                cb.call(this, data);
            }.bind(this));
        },

        showContent: function(data) {
            var dates = data.map(function(obj) { return (new Date(obj.date)) });
                maxDate = new Date(Math.max.apply(null, dates));
                minDate = new Date(Math.min.apply(null, dates));
            
            var dateRange = getDates(minDate, maxDate);

            var margin = {top: 10, right: 10, bottom: 40, left: 40 },
                width = 770 - margin.right - margin.left,
                height = 470 - margin.top - margin.bottom;

            var x = d3.scale.ordinal()
                    .rangeRoundBands([0, width], .5);

            var yTasks = d3.scale.linear()
                    .range([height, 0]);

            var yTime = d3.scale.linear()
                    .range([height, 0]);

            var xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom");

            var yAxis = d3.svg.axis()
                        .scale(yTasks)
                        .orient("left")
                        .tickFormat(d3.format("d"));

            var div = d3.select(".stats-content-wrap").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

            var chart = d3.select(".chart")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .on("click", function() { 
                            div.transition().duration(200).style("opacity", 0) 
                        })
                    .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            x.domain(dateRange.map(function(d) {
                return (d.getFullYear() + "-" 
                        + ("0" + (d.getMonth()+1)).slice(-2) + "-" 
                        + ("0" + d.getDate()).slice(-2) )
            }));
            yTasks.domain([0, d3.max(data, function(d) { return d.tasks })]);
            yTime.domain([0, d3.max(data, function(d) { return d.time })]);

            chart.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0, " + height + ")")
                .call(xAxis);

            chart.append("g")
                .attr("class", "y axis")
                .call(yAxis)
            .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Liczba zrobionych notatek");

            chart.selectAll(".bar")
                .data(data)
            .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return x(d.date); })
                .attr("width", x.rangeBand())
                .attr("height", 0)
                .attr("y", function() { return height })
                .on("click", function(d) {
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div.html(this.bubbleTemplate({col: d.collections}))
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY) + "px")
                    d3.event.stopPropagation();
                }.bind(this))
                // .on("mouseleave", function (d) {
                //     div.transition()
                //         .duration(200)
                //         .style("opacity", 0);
                // })
                // .on("mousemove", function(d) {
                //     div.style("left", (d3.event.pageX) + "px")
                //     div.style("top", (d3.event.pageY) + "px")
                // })
            .transition()
                .delay(function(d, i) { return i * 300 })
                .duration(300)
                .attr("height", function(d) { return height - yTasks(d.tasks) })
                .attr("y", function(d) { return yTasks(d.tasks); });
        }
    })
})
