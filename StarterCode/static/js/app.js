
// function that updates the dashboard

// function to populate metadata
function demoInfo(sample){
    //console.log(sample);

    //Get metadata
    d3.json("../StarterCode/static/js/samples.json").then((data) => {
        let metadata = data.metadata;
        //console.log(metadata);

        // Filter based on the value of the sample (should return 1 result based on id)
        let result = metadata.filter(sampleResult  => sampleResult.id == sample);
        //console.log(result)

        // Access index 0 from array which has metadata for id
        let resultData = result[0]
        console.log(resultData)

        // Clear meta-data when drop down value is changed
        d3.select("#sample-metadata").html("")

        // use object entries to get the value lye pairs
        Object.entries(resultData).forEach(([key, value]) => {

            // add to the sample data / demogrqphics section, grab id from index.html
            d3.select("#sample-metadata")
                .append("h5").text(`${key}: ${value}`)        

        });
    });


}
// function build a bar chart
function buildBarChart(sample){
    console.log(sample);    

    //Get sampledata
    d3.json("../StarterCode/static/js/samples.json").then((data) => {
    let sampleData = data.samples;
    //console.log(sampleData);

    // Filter based on the value of the sample (should return 1 result based on id)
    let result = sampleData.filter(sampleResult  => sampleResult.id == sample);
    //console.log(result)

    // Access index 0 from array which has metadata for id
    let resultData = result[0]
    //console.log(resultData)

    // get the out_ids
    let otu_ids = resultData.otu_ids;
    let otu_labels = resultData.otu_labels;
    let sample_values = resultData.sample_values;

    // console.log(otu_ids);
    // console.log(otu_labels);
    // console.log(sample_values);

    // Build bar chart
    // get the yTicks, requirement is get top 10, slice will be used get 10
    let yTicks = otu_ids.slice(0, 10).map(id => `OTU ${id}`);
    let xValues = sample_values.slice(0, 10);
    let textLabels = otu_labels.slice(0, 10);
    //console.log(textLabels)

    // Create a barchart object using reverse function to make it descending order 
    let barChart = {
        y: yTicks.reverse(),
        x: xValues.reverse(),
        text: textLabels.reverse(),
        type: "bar", 
        orientation: "h"
    }

    let layout = {
        title: "Top 10 Belly Button Bacteria"
    };
    // Plot a barchart at div with id as "bar"
    Plotly.newPlot("bar", [barChart], layout);
    });
}

// function that builds bubble chart
function bubbleChart(sample) {
    //Get sampledata
    d3.json("../StarterCode/static/js/samples.json").then((data) => {
        let sampleData = data.samples;
        //console.log(sampleData);
    
        // Filter based on the value of the sample (should return 1 result based on id)
        let result = sampleData.filter(sampleResult  => sampleResult.id == sample);
        //console.log(result)
    
        // Access index 0 from array which has metadata for id
        let resultData = result[0]
        //console.log(resultData)
    
        // get the out_ids
        let otu_ids = resultData.otu_ids;
        console.log(otu_ids);
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;
    
        // Build Bubble chart
        let bubbleChart = {
            y: sample_values,
            x: otu_ids,
            text: otu_labels,
            mode: "markers", 
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Sequential"
            }
        }
    
        let layout = {
            title: "Bacteria Cultures Per Sample",
            hovermode: "Closest",
            xaxis: {title: "OTU ID"}
        };
        // Plot a barchart at div with id as "bar"
        Plotly.newPlot("bubble", [bubbleChart], layout);
        });
    

}

// function that initializes the dashboard
function initialize()
{
    // Load data from samples json
    let data = d3.json("../StarterCode/static/js/samples.json");
    //console.log(data);

    // Access the dropdown from index.html using id
    var select = d3.select("#selDataset")

    // Add to selector using d3.json
    d3.json("../StarterCode/static/js/samples.json").then((data) => {
        let sampleNames = data.names // array of just the names
        //console.log(sampleNames);

        // Create option for each sample
        sampleNames.forEach((sample) => {
           select.append("option") 
            .text(sample) // on selecting a value optionChanged function will be called
            .property("value", sample);
        });

    // When initialized, pass in the information for the first sample
    let sample1 = sampleNames[0];

    // call the function to build the metadata
    demoInfo(sample1);

    // function build a bar chart
    buildBarChart(sample1);

    });
}

// function to update on change when dropdown value is selected
function optionChanged(item){
   // console.log(item);
   // Call update to the metadata
   demoInfo(item);

   buildBarChart(item);

   bubbleChart(item);
}


// Call initiaze function when live server starts
initialize();
