async function go() {
    const x = await fetch("https://www.jonathanokeeffe.com/strava/ajaxV3GetActivities.php5", {
        "headers": {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-ch-ua": "\"Google Chrome\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
        },
        "referrer": "https://www.jonathanokeeffe.com/strava/map.php",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": "whichAthlete=own&athlete=&startDate=01%2F01%2F2023&endDate=&segment=&keyword=&drawingMode=slow&activityType=All&commute=all",
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });

    const result = await x.text();
    console.log(result);

    console.log(x.status);
    console.log(x.statusText);
}

void go();