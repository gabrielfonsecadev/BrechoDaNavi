import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    createdAt: string;
}

export type ProductPayload = Omit<Product, 'id' | 'createdAt' | 'images'>;

@Injectable({ providedIn: 'root' })
export class ProductAdminService {
    private readonly baseUrl = 'http://localhost:5000';

    constructor(private http: HttpClient) { }

    private get headers(): HttpHeaders {
        const apiKey = localStorage.getItem('brecho_api_key') ?? '';
        return new HttpHeaders({ 'x-api-key': apiKey });
    }

    getAll(): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.baseUrl}/products`);
    }

    create(product: ProductPayload): Observable<Product> {
        return this.http.post<Product>(`${this.baseUrl}/admin/products`, product, {
            headers: this.headers
        });
    }

    update(id: string, product: ProductPayload): Observable<Product> {
        return this.http.put<Product>(`${this.baseUrl}/admin/products/${id}`, product, {
            headers: this.headers
        });
    }

    markAsSold(id: string): Observable<any> {
        return this.http.patch(`${this.baseUrl}/admin/products/${id}/sold`, {}, {
            headers: this.headers
        });
    }

    uploadImage(productId: string, file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);

        return this.http.post(`${this.baseUrl}/admin/products/${productId}/images`, formData, {
            headers: this.headers
        });
    }

    deleteImage(productId: string, imageId: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/admin/products/${productId}/images/${imageId}`, {
            headers: this.headers
        });
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/admin/products/${id}`, {
            headers: this.headers
        });
    }
}
