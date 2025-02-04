import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../service/api.service';
import {NgForOf} from '@angular/common';
import {Usuario} from '../../interface/usuario';




@Component({
  selector: 'app-test-api',
  templateUrl: './test-api.component.html',
  styleUrls: ['./test-api.component.css'],
  imports: [
    NgForOf
  ]
})
export class TestApiComponent implements OnInit {

  constructor(private apiService: ApiService ) {  }

  users: Usuario[] = [];
  ngOnInit(): void {
    this.loadUsers().then(users => {
      this.users = users; // Assuming 'users' is the property where you store the fetched users
    }).catch(error => {
      console.error('Error fetching users:', error); // Handle any errors that occur during the fetch
    });

  }

  async loadUsers(): Promise<any> {
    try {
      return await this.apiService.getUsers(); // Call the service to fetch users
    } catch (error) {
      console.error('Error in loadUsers:', error);
      throw error; // Rethrow the error to be caught in ngOnInit

    }

  }


}
