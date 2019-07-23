import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'stryker-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  public src: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    const { provider, owner, name, branch, label } = this.route.snapshot.params;
    const slug = [provider, owner, name, branch, label].filter(Boolean).join(';');
    this.src = `http://localhost:10000/devstoreaccount1/mutation-testing-report/${slug}`;
  }

}
