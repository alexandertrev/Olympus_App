import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';
import { Events } from 'ionic-angular';
import { SensorRecordProvider } from '../../providers/providers';
import { WaterRecordProvider, UserProfileProvider } from '../../providers/providers';

@IonicPage()
@Component({
    selector: 'page-user-device-statistics',
    templateUrl: 'user-device-statistics.html',
})
export class UserDeviceStatisticsPage {
    @ViewChild('barCanvas') barCanvas;
    @ViewChild('doughnutCanvas') doughnutCanvas;
    @ViewChild('lineCanvas') lineCanvas;
    barChart: any;
    lineChart: any;
    doughnutChart: any;

    userDevice: any;
    recordList: any = [];
    waterList: any = [];
    profiles: any = [];

    out_of_profile: any = 0;
    in_profile:any = 0;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public events: Events,
        private sensorProvider: SensorRecordProvider,
        private waterProvider: WaterRecordProvider,
        private userProfileProvider: UserProfileProvider) {

        this.userDevice = navParams.data;
        setTimeout(() => {
            console.log('its time')
            this.calculateOutOfProfile();
            console.log(this.out_of_profile);
            console.log(this.in_profile);
        }, 3000);
    }

    calculateOutOfProfile(){
        console.log('inside')
        let profile_index=0;
        for(let i=0;i < this.recordList.length;i++){
            let cur_record = this.recordList[i];
            let record_date = new Date(cur_record.date);
            let relevant_profile;
            

            for(let j=profile_index; j< this.profiles.length;j++){
                let profile_date = new Date(this.profiles[j].changeDate);
                if(record_date > profile_date){
                    console.log('relevant')
                    relevant_profile = this.profiles[j];
                    profile_index = j;
                }
                else{
                    console.log('break')
                    break;
                }
            }
            if(relevant_profile!=null){
                this.makeCompare(cur_record, relevant_profile);
            }
            relevant_profile = null;

        }
    }
    makeCompare(cur_record, profile){
        console.log('inside')
        if(cur_record.moist > profile.moistMax || cur_record.moist < profile.moistMin)
            this.out_of_profile++;
        else if(cur_record.heat > profile.heatMax || cur_record.heat < profile.heatMin)
            this.out_of_profile++;
        else if(cur_record.sun != profile.sunNeeds)
            this.out_of_profile++;
        else 
            this.in_profile++;
    }

    ionViewDidEnter() {
        console.log('lol')
        
        this.sensorProvider.getAllSensorRecord(this.userDevice.device.mac).subscribe(data => {
            console.log(data)
            if (data['success']){
                this.recordList = data['answer'];
                console.log(this.recordList)
            }
                
        })

        this.waterProvider.getAllSensorRecord(this.userDevice.device.mac).subscribe(data => {
            console.log(data)
            if (data['success'])
                this.waterList = data['answer'];
        })

        this.userProfileProvider.getUserProfiles(this.userDevice.linkedTo).subscribe(data => {
            if(data['success']){
                this.profiles = data['answer']
                console.log(this.profiles)
            }
        })
 

        this.barChart = new Chart(this.barCanvas.nativeElement, {

            type: 'bar',
            data: {
                labels: ["Su", "Mo", "Tu", "Wes", "Th", "Fr", "Sa"],
                datasets: [{
                    label: '# of water',
                    data: [12, 19, 3, 5, 2, 3, 8],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }

        });

        this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {

            type: 'doughnut',
            data: {
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    hoverBackgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56"
                    ]
                }]
            }

        });
        this.lineChart = new Chart(this.lineCanvas.nativeElement, {

            type: 'line',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [
                    {
                        label: "My First dataset",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(75,192,192,0.4)",
                        borderColor: "rgba(75,192,192,1)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(75,192,192,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(75,192,192,1)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: [65, 59, 80, 81, 56, 55, 40],
                        spanGaps: false,
                    }
                ]
            }

        });
    }

    back() {
        this.events.publish('close-modal');
    }
}
