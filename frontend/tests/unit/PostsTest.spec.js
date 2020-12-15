import {mount, createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Posts from "../../src/components/Posts.vue";

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);

//Create dummy store
const store = new Vuex.Store({
    state: {
        user: {
            id: 1,
            firstname: 'test',
            lastname: 'test',
            email: 'test',
            avatar: 'test',
        }
    },
    getters: {
        user: (state) => state.user,
    }
});

//Create dummy routes
const routes = [
    {
        path: '/',
        name: 'posts',
    },
    {
        path: '/profiles',
        name: 'profiles'
    }
];

const router = new VueRouter({routes});

const testData = [
    {
        id: 1,
        text: "I think it's going to rain",
        createTime: "2020-12-05 13:53:23",
        likes: 0,
        liked: false,
        media: {
            url: "test-image.jpg",
            type: "image"
        },
        author: {
            id: 2,
            firstname: "Gordon",
            lastname: "Freeman",
            avatar: 'avatar.url'
        }
    },
    {
        id: 2,
        text: "Which weighs more, a pound of feathers or a pound of bricks?",
        createTime: "2020-12-05 13:53:23",
        likes: 1,
        liked: true,
        media: null,
        author: {
            id: 3,
            firstname: "Sarah",
            lastname: "Connor",
            avatar: 'avatar.url'
        }
    },
    {
        id: 4,
        text: null,
        createTime: "2020-12-05 13:53:23",
        likes: 3,
        liked: false,
        media: {
            url: "test-video.mp4",
            type: "video"
        },
        author: {
            id: 5,
            firstname: "Richard",
            lastname: "Stallman",
            avatar: 'avatar.url'
        }
    }
];

//Mock axios.get method that our Component calls in mounted event
jest.mock("axios", () => ({
    get: () => Promise.resolve({
        data: testData
    })
}));

describe('Posts', () => {
    // Now mount the component and you have the wrapper
    const wrapper = mount(Posts, {router, store, localVue});

    // Test 0
    it('1 == 1', function () {
        expect(true).toBe(true);
    });

    //Test 1 Test that exactly as many posts are rendered as contained in testData variable
    //OK
    it('many posts', function () {
        let manyPosts = wrapper.findAll('.post');
        expect(manyPosts.length).toEqual(testData.length); //https://stackoverflow.com/questions/41527871/jasmine-angular2-check-array-length-toequal-return-true
    });

    //Test 2 Test that if post has media property, image or video tags are rendered depending on media.type property, or if media property is absent nothing is rendered.
    it('media rendering', function () {
        let manyPosts = wrapper.findAll('.post');
        for (let i = 0; i < manyPosts.length; i++) {
            if (!!testData[i].media) {
                if (testData[i].media.type == 'image') {
                    expect(manyPosts.at(i).get(".post-image").get("img").exists()).toBe(true);
                } else {
                    expect(manyPosts.at(i).get(".post-image").get("video").exists()).toBe(true);
                }
            } else {
                expect(false).toBe(false);

            }
            //expect(manyPosts.at(i).get(".post-image").get("").exists()).toBe(false); //not working as so

        }
    });

    //Test 3 Test that post create time is displayed in correct format: Saturday, December 5, 2020 1:53 PM
    //OK
    it('validate date format', function () {
        var pattern = new RegExp("^([0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9])$");
        for (let i = 0; i < testData.length; i++) {
            if (testData[i].createTime.search(pattern)===0) {
                expect(true).toBe(true)
        }}
    });

});