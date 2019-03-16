const axios = require('axios')
const expect = require('chai').expect

const GithubApi = require('./githubApi').default

describe('The githubApi module', function () {
  it('returns pull requests when properly configured', function () {
    return new Promise((resolve, reject) => {
      // Arrange
      let expectedData = [ {}, {} ]
      const getResolved = new Promise((r) => r({ data: expectedData }))
      var mockAxios = this.sandbox.mock(axios);

      mockAxios.expects('get').withArgs(
        'https://api.github.com/repos/org/repo/pulls',
        { headers: { Authorization: "Basic dGVzdFVzZXI6dGVzdFBhc3M=" } }
      ).returns(getResolved)

      // Act
      gh = new GithubApi('testUser', 'testPass')
      gh.getPullRequests('org/repo').then(data => {
        // Assert
        mockAxios.verify();
        expect(data).to.equal(expectedData)
        resolve()
      }).catch(r => { reject(r) })
    })
  })

  it('returns pull requests reviews when properly configured', function () {
    return new Promise((resolve, reject) => {
      // Arrange
      let expectedData = [ {}, {} ]
      const getResolved = new Promise((r) => r({ data: expectedData }))
      var mockAxios = this.sandbox.mock(axios);

      mockAxios.expects('get').withArgs(
        'https://api.github.com/repos/org/repo/pulls/1/reviews',
        { headers: { Authorization: "Basic dGVzdFVzZXI6dGVzdFBhc3M=" } }
      ).returns(getResolved)

      // Act
      gh = new GithubApi('testUser', 'testPass')
      gh.getPullRequestReviews('org/repo', 1).then(data => {
        // Assert
        mockAxios.verify();
        expect(data).to.equal(expectedData)
        resolve()
      }).catch(r => { reject(r) })
    })
  })

  it('fails request properly when promise rejected', function () {
    return new Promise((resolve, reject) => {
      // Arrange
      let expectedError = new Error('test error')
      const getResolved = new Promise((_resolve, reject) => reject(expectedError))
      var mockAxios = this.sandbox.mock(axios);

      mockAxios.expects('get').withArgs(
        'https://api.github.com/repos/org/repo/pulls/1/reviews',
        { headers: { Authorization: "Basic dGVzdFVzZXI6dGVzdFBhc3M=" } }
      ).returns(getResolved)

      // Act
      gh = new GithubApi('testUser', 'testPass')
      gh.getPullRequestReviews('org/repo', 1).then(() => {
        reject(new Error('Test succeeded when it should of failed'))
      }).catch(r => {
        // Assert
        mockAxios.verify();
        expect(r).to.equal(expectedError)
        resolve()
      })
    })
  })
})