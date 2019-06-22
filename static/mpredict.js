
$('#image-selector').change(()=>{
    const reader = new FileReader();
    reader.onload = function(){
        let dataURL = reader.result;
        $('#selected-image').attr("src",dataURL);
        $('#prediction-list').empty();
    }
    console.log($('#image-selector'))
    let file = $("#image-selector").prop('files')[0];
    reader.readAsDataURL(file);

});

let model;


(async ()=>{
    console.log("loading")
    model = await tf.loadModel('http://localhost:81/tfjs-models/VGG16/model.json');
    console.log("loaded")
    $('#progress-bar').hide();
})();

$('#predict-button').click(async ()=>{
    console.log($('#selected-image'))
    let image = $('#selected-image').get(0);
    let meanImageNetRGB= tf.tensor1d([123.68,116.779,103.939]); 
    let tensor=tf.fromPixels(image)
    .resizeNearestNeighbor([224,224])
    .toFloat()
    .sub(meanImageNetRGB)
    .reverse(2)
    .expandDims(); 




        ///??????


        let predictions = await model.predict(tensor).data();
        let top5 = Array.from(predictions)
            .map((p,i)=>{
                return{
                    probability:p,
                    className:IMAGENET_CLASSES[i]
                };
            }).sort((a,b)=>{
                return b.probability-a.probability;
            }).slice(0,5);

        $('#prediction-list').empty();     
        top5.forEach((p)=>{
            $('#prediction-list').append(`<li>${p.className}: ${p.probability}</li>`)
        });    
});
