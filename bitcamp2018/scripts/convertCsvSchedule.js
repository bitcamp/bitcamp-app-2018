var fs = require('fs');
var moment = require('moment');

let scheduleFile = process.argv[2];
//console.log(scheduleFile);

// maps first name to id
let friObj = [];
let satObj = [];
let sunObj = [];

let dayMap = {"Friday" : friObj, "Saturday" : satObj, "Sunday" : sunObj};

finalJson = {"Schedule" : [["Friday", friObj], ["Saturday", satObj], ["Sunday", sunObj]]};

fs.readFile(scheduleFile, 'utf8', (err, data) => {


  if(err){
    throw err;
  } else {

    //console.log(data);
    data = data.replace(/"/g, "");
    let lines = data.split("\r\n");
    //console.log(lines);
    example = lines[12].split(',');

    // for(let i = 0; i < example.length; i++){
    //   console.log (i.toString() + " => " + example[i]);
    // }


    for(let i = 1; i < lines.length; i++){
      let line = lines[i];
      fields = line.split(",")
      eventObj = {
          "description" : fields[13],
          "endTime" : moment(fields[11], "M/D/YYYY HH:mm:ss").format("YYYY-MM-DD HH:mm"),
          "key" : 100000 + i,
          "location" : fields[12],
          "startTime" : moment(fields[6], "M/D/YYYY HH:mm:ss").format("YYYY-MM-DD HH:mm"),
          "title" : fields[1]
        };
        //console.log(eventObj)
        //console.log(fields[0]);
      dayMap[fields[0]].push(JSON.stringify(eventObj));
    }

    out = JSON.stringify(finalJson, null, 4);
    out = out.replace(/"{/g, "{");
    out = out.replace(/}"/g, "}");
    out = out.replace(/\\/g, "");
    out = out.replace(/,"/g, ",\n\"")
    fs.writeFileSync('scheduleOutput.json', out);
  }
});
