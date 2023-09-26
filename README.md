# activate-unity

<p align="left">
  <a href="https://github.com/kuler90/activate-unity/actions"><img alt="GitHub Actions status" src="https://github.com/kuler90/activate-unity/workflows/test%20personal%20license/badge.svg?branch=master"></a>
</p>

GitHub Action to activate personal or professional Unity license. License will be automatically returned at the end of a job.

Works on Linux, macOS and Windows.

## Inputs

### `unity-path`

Path to Unity executable. `UNITY_PATH` env will be used if not provided.

### `unity-username`

**Required** Unity account username.

### `unity-password`

**Required** Unity account password.

### `unity-authenticator-key`

Unity account [authenticator key](#How-to-obtain-authenticator-key) for Authenticator App (Two Factor Authentication). Used for account verification during Personal license activation.

### `unity-serial`

Unity license serial key. Used for Plus/Professional license activation.

## How to obtain authenticator key

1. Login to Unity account
2. Go to account settings
3. Activate Two Factor Authentication through Authenticator App
4. On page with QR code click "Can't scan the barcode?" and save key (remove spaces in it)
5. Finish activation

## Example usage

```yaml
- name: Checkout code
  uses: actions/checkout@v2
   
- name: Get Unity Version
  id: unity-version
  run: |
     UNITY_VERSION=$(grep -oP 'm_EditorVersionWithRevision: \K[0-9]+\.[0-9]+\.[0-9]+[a-zA-Z0-9]*' ProjectSettings/ProjectVersion.txt)
     echo "UNITY_VERSION=$UNITY_VERSION" >> $GITHUB_ENV
     echo "Unity version is $UNITY_VERSION"
     
- name: Request .alf file
  id: alfFile
  uses: game-ci/unity-request-activation-file@v2
  with:
    unityVersion: ${{ env.UNITY_VERSION }}

- name: Activate unity
  id: ulfFile
  uses: zxc30314/activate-unity@master
  with:
    unity-username: ${{ secrets.UNITY_USERNAME }}
    unity-password: ${{ secrets.UNITY_PASSWORD }}
    unity-authenticator-key: ${{ secrets.UNITY_AUTHENTICATOR_KEY }}
    unity-alf-path: ${{ steps.alfFile.outputs.filePath  }} 

- name: Read ulf
  id: ulfRead
  uses: juliangruber/read-file-action@v1.1.4
  with:
    path: ${{ steps.ulfFile.outputs.filePath }}

- name: Update secret UNITY_LICENSE
  uses: hmanzur/actions-set-secret@v2.0.0
  with:
    name: 'UNITY_LICENSE'
    value: '${{ steps.ulfRead.outputs.content }}'
    token: ${{ secrets.ACCESS_TOKEN }}

```
