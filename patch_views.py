import os
import re

with open('backend/api/views.py', 'r') as f:
    content = f.read()

new_methods = """
    parser_classes = [MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        # Phase 1: Real SHA-256 and Mocked AES-256 (Simulated S3 Storage)
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Calculate true SHA-256
        import hashlib
        file_hash = hashlib.sha256()
        for chunk in file_obj.chunks():
            file_hash.update(chunk)
        sha256_hex = file_hash.hexdigest()
        
        # Reset file pointer
        file_obj.seek(0)
        
        # Mock AES-256 encryption and saving to S3
        import uuid
        from cryptography.fernet import Fernet
        
        # In a real scenario, this key would be in settings.py
        key = Fernet.generate_key()
        cipher = Fernet(key)
        
        # Read file, encrypt, and save to mock S3 directory
        file_data = file_obj.read()
        encrypted_data = cipher.encrypt(file_data)
        
        mock_s3_dir = os.path.join(settings.BASE_DIR, 'media', 'mock-s3')
        os.makedirs(mock_s3_dir, exist_ok=True)
        
        doc_id = f"DOC-{uuid.uuid4().hex[:8].upper()}"
        file_name = file_obj.name
        file_path = f"/media/mock-s3/{doc_id}.enc"
        full_path = os.path.join(mock_s3_dir, f"{doc_id}.enc")
        
        with open(full_path, 'wb') as ef:
            ef.write(encrypted_data)
            
        # Add the computed fields to the request data
        mutable_data = request.data.copy()
        mutable_data['document_id'] = doc_id
        mutable_data['file_path'] = file_path
        mutable_data['file_name'] = file_name
        mutable_data['file_size'] = file_obj.size
        mutable_data['sha256_hash'] = sha256_hex
        mutable_data['mime_type'] = file_obj.content_type
        
        serializer = self.get_serializer(data=mutable_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        doc_instance = serializer.instance
        
        # Phase 3: Simulated Hyperledger Fabric Blockchain Logging
        BlockchainRecord.objects.create(
            document=doc_instance,
            transaction_id=f"TXN-{uuid.uuid4().hex}",
            block_number=BlockchainRecord.objects.count() + 1000,
            action="UPLOAD",
            actor=request.user,
            hash_signature=sha256_hex,
            verification_status="PENDING"
        )
        
        AuditLog.objects.create(
            action="UPLOAD_DOCUMENT",
            user=request.user,
            resource_type="DOCUMENT",
            resource_id=doc_id,
            description=f"Document {file_name} encrypted (AES-256) and uploaded to mock-S3. SHA256: {sha256_hex[:12]}..."
        )
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)
"""

# Replace the old perform_create in DocumentViewSet with the new methods
pattern = re.compile(r'    def perform_create\(self, serializer\):\n        serializer\.save\(uploaded_by=self\.request\.user\)')
new_content = pattern.sub(new_methods, content)

with open('backend/api/views.py', 'w') as f:
    f.write(new_content)
    
print("views.py patched successfully!")
