import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Editor, Toolbar } from 'ngx-editor';
import { BlogPostService } from 'src/app/services/blog-post.service';

interface Role {
  id: number;
  name: string;
}
export type MediaType = 'image' | 'audio' | 'video';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit, OnDestroy {

  editor!: Editor;
  postForm!: FormGroup;
 selectedFiles: File[] = [];
  // Later, load these roles from your .NET Web API.
  roles: Role[] = [
    { id: 1, name: 'Anonymous' }
  ];

  saving = false;
  errorMessage = '';

  toolbar: Toolbar = [
    ['bold', 'italic', 'underline'],
    ['bullet_list', 'ordered_list'],
    ['blockquote'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['link']
  ];

  constructor(
    private fb: FormBuilder,
    private blogService: BlogPostService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.editor = new Editor();

    // Find the Anonymous role instead of assuming its ID is always 1.
    const defaultRole = this.roles.find(
      role => role.name === 'Anonymous'
    );

    this.postForm = this.fb.group({
      roleid: [defaultRole?.id ?? null, Validators.required],
      title: ['', [Validators.required, Validators.maxLength(150)]],
      description: ['', Validators.required]
    });
  }

  // Display the name associated with the selected role ID.
  get roleName(): string {
    const roleId = this.postForm?.get('roleid')?.value;

    return this.roles.find(role => role.id === Number(roleId))?.name ?? '';
  }

  private getPlainText(html: string): string {
    const element = document.createElement('div');
    element.innerHTML = html || '';

    return (element.textContent || element.innerText || '')
      .replace(/\u00a0/g, ' ')
      .trim();
  }

  addpost(): void {
    this.errorMessage = '';

    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    const formValue = this.postForm.getRawValue();
    const title = formValue.title.trim();
    const description = formValue.description || '';

    if (!title) {
      this.errorMessage = 'Please enter a title.';
      return;
    }

    if (!this.getPlainText(description)) {
      this.errorMessage = 'Please enter a description.';
      return;
    }

    this.saving = true;

    this.blogService.createPost({
      roleid: Number(formValue.roleid),
      title,
      description
    }).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/']);
      },
      error: error => {
        this.saving = false;
        this.errorMessage =
          error.error?.message ?? 'Unable to create post.';
      }
    });
  }

onFileSelected(event:any,explicitType?: MediaType){
   if (event.target.files.length > 0) {
      const allowedTypes = ['audio/mpeg', 'image/png', 'image/jpeg', 'image/jpg', 'video/mp4'];
      this.selectedFiles = [];

      for (let i = 0; i < event.target.files.length; i++) {
        const file: File = event.target.files[i];
        if (!allowedTypes.includes(file.type)) {
          alert('Only mp3, png, jpg, jpeg or mp4 files are allowed!');
          continue; // skip invalid file
        }
        this.selectedFiles.push(file);
        console.log(this.selectedFiles);
      }

      if (this.selectedFiles.length === 0) {
        this.postForm.patchValue({ file: null });
      }
    }
}


  cancel(): void {
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.editor?.destroy();
  }
}