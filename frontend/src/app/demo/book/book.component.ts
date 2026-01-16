import { Component, inject, signal } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { Book, BookService } from 'src/app/theme/shared/service/book';
import { PopupForm } from '../../theme/shared/components/popup-form/popup-form';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-books',
  imports: [DataTablesModule, PopupForm],
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BooksComponent {
  private bookService = inject(BookService);
  books = signal([]);
  isEdit = false;
  selectedBookId = '';

  dtOptions: Config = {};
  dtTrigger: Subject<any> = new Subject<any>();

  columns = [
    {
      title: 'ลำดับ'
    },
    {
      title: 'ปกหนังสือ'
    },
    {
      title: 'ชื่อเรื่อง'
    },
    {
      title: 'ผู้แต่ง'
    },
    {
      title: 'หมวดหมู่'
    },
    {
      title: 'สำนักพิมพ์'
    },
    {
      title: 'ราคา/วัน'
    },
    {
      title: 'จำนวนเล่มคงเหลือ'
    },
    {
      title: ''
    }
  ];

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      columnDefs: [{ orderable: false, targets: 8 }],
      language: {
        search: '',
        searchPlaceholder: 'ค้นหาผู้ใช้งาน',
        lengthMenu: 'แสดง _MENU_ รายการ',
        info: 'แสดง _START_ ถึง _END_ จาก _TOTAL_ รายการ',
        infoEmpty: 'ไม่พบข้อมูล',
        infoFiltered: '(กรองจากทั้งหมด _MAX_ รายการ)',
        zeroRecords: 'ไม่พบข้อมูลที่ตรงกัน',
        emptyTable: 'ไม่มีข้อมูลในตาราง',
        loadingRecords: 'กำลังโหลด...',
        processing: 'กำลังประมวลผล',
        paginate: {
          first: 'หน้าแรก',
          last: 'หน้าสุดท้าย',
          next: 'ถัดไป',
          previous: 'ก่อนหน้า'
        }
      }
    };
    this.bookService.getBooks().subscribe((res) => {
      this.books.set(res.data);
      this.dtTrigger.next(null);
    });
  }

  OnEditFormModal(bookId: string) {
    const modalEl = document.getElementById('bookModal');
    this.isEdit = true;
    this.selectedBookId = bookId;
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  OnViewDetail(book: Book) {
    console.log('it work!!!');
  }
}
