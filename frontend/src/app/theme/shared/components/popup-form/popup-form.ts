import { Component, ElementRef, inject, Input, signal, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Field, form, min, required } from '@angular/forms/signals';
import { NgSelectModule } from '@ng-select/ng-select';
import { CategoryService } from '../../service/category';
import { PublisherService } from '../../service/publisher';
import { Book, BookService } from '../../service/book';
import Swal from 'sweetalert2';
import { UploadService } from '../../service/upload';

@Component({
  selector: 'app-popup-form',
  imports: [FormsModule, Field, NgSelectModule],
  templateUrl: './popup-form.html',
  styleUrl: './popup-form.scss'
})
export class PopupForm {
  @Input() isEdit: boolean;
  @Input() bookId: string;
  constructor(private cdr: ChangeDetectorRef) {}
  private categoryService = inject(CategoryService);
  private publisherService = inject(PublisherService);
  private bookService = inject(BookService);
  private uploadService = inject(UploadService);

  submitted = signal(false);
  //categories = signal([]);
  categoryItems: any[] = [];
  publishers = signal([]);
  selectedCategoriesId = [];

  selectedPublishersId = null;
  selectedFile = null;
  fileErrorText = '';
  fileInValid = false;

  bookModel = signal<Book>({
    title: '',
    author: '',
    description: '',
    img_url: '',
    price_per_day: null,
    total_copies: null,
    publisherId: null,
    categories: []
  });

  bookForm = form(this.bookModel, (schemaPath) => {
    required(schemaPath.title, { message: 'กรุณากรอกชื่อหนังสือ' });
    required(schemaPath.author, { message: 'กรุณากรอกชื่อผู้แต่ง' });
    required(schemaPath.price_per_day, { message: 'กรุณากรอกราคาเช่า' });
    min(schemaPath.price_per_day, 1, { message: 'ราคาเช่าต้องมากกว่า 0' });
    required(schemaPath.total_copies, { message: 'กรุณากรอกจำนวนหนังสือ' });
    min(schemaPath.total_copies, 1, { message: 'จำนวนหนังสือต้องมากกว่า 0' });
    //required(schemaPath.publisher_id, { message: 'กรุณากรอกชื่อสำนักพิมพ์' });
  });

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
  //compareById = (a: any, b: any) => a === b;

  ngOnChanges() {
    if (this.isEdit && this.bookId) {
      this.bookService.getBook(this.bookId).subscribe((res) => {
        console.log(typeof res.data.categories);
        this.bookModel.set({
          title: res.data.title,
          author: res.data.author,
          description: res.data.description,
          img_url: res.data.img_url,
          price_per_day: res.data.price_per_day,
          total_copies: res.data.total_copies,
          publisherId: res.data.publisherId,
          categories: res.data.categories
        });
        this.selectedPublishersId = res.data.publisherId;
        this.selectedCategoriesId = (res.data.categories ?? []).map((x: any) => String(x));

        console.log(res.data);
        // บังคับให้ view อัปเดต (ช่วยในหลายเคส)
        this.cdr.detectChanges();
      });
    }
  }

  categories: any[] = [];

  ngOnInit() {
    this.categoryService.getCategories().subscribe((res) => {
      this.categories = res.data;
    });

    this.publisherService.getPublishers().subscribe((res) => {
      this.publishers.set(res.data);
    });
  }

  ngAfterViewInit() {
    const modalEl = document.getElementById('bookModal');
    modalEl?.addEventListener('hidden.bs.modal', () => {
      this.submitted.set(false);
      this.resetForm();
    });
  }

  resetForm() {
    this.bookModel.set({
      title: '',
      author: '',
      description: '',
      img_url: '',
      price_per_day: null,
      total_copies: null,
      publisherId: null,
      categories: []
    });
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.selectedCategoriesId = [];
    this.selectedPublishersId = null;
    this.fileErrorText = '';
    this.fileInValid = false;
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) {
      this.fileErrorText = 'กรุณาเลือกไฟล์';
      this.fileInValid = true;
      return;
    }

    this.selectedFile = input.files[0];
    this.fileErrorText = '';
    this.fileInValid = false;
  }

  onAddPublisher = (publisher_name: string) => {
    this.publisherService.addPublisher({ name: publisher_name }).subscribe((res) => {
      this.publishers.set([...this.publishers(), res.data]);
      this.selectedPublishersId = res.data._id;
    });
  };

  onAddCategory = (category_type: string) => {
    this.categoryService.addCategory({ category_type: category_type }).subscribe((res) => {
      // this.categories.set([...this.categories(), res.data]);
      // this.selectedCategoriesId.push(res.data._id);
    });
  };

  onSubmit(event: Event) {
    if (!this.selectedFile) {
      this.fileErrorText = 'กรุณาเลือกไฟล์';
      this.fileInValid = true;
    }
    this.submitted.set(true);
    event.preventDefault();
    if (this.bookForm().valid() && !this.fileInValid) {
      this.uploadService.uploadFile(this.selectedFile).subscribe((res) => {
        this.bookModel.update((model) => ({
          ...model,
          img_url: res.url,
          publisherId: this.selectedPublishersId,
          categories: this.selectedCategoriesId
        }));
        this.bookService.addBook(this.bookModel()).subscribe((res) => {
          Swal.fire({
            icon: 'success',
            title: res.message,
            confirmButtonText: 'ตกลง'
          });
          this.submitted.set(false);
          this.resetForm();
          const closeBtn = document.querySelector('#bookModal .btn-close') as HTMLElement;
          closeBtn?.click();
        });
      });
    }
  }
}
