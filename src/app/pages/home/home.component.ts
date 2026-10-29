import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { BlogPostService } from 'src/app/services/blog-post.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  posts: any[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private blogService: BlogPostService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading = true;

    this.blogService.getAllPost().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load posts.';
        this.loading = false;
      }
    });
  }

  getSafeHtml(html: string): SafeHtml {
    // Angular's normal HTML binding sanitizes HTML.
    // Do not use bypassSecurityTrustHtml for user-authored posts.
    return this.sanitizer.sanitize(1, html) ?? '';
  }
}
