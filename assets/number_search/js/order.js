$(document).ready(function(){
	//$.validator.messages.required = "";
	//$("#frmForwardNumber").validate();

	$("div.dialing-block a").click(function(){
		if($('#postfix_number').val().length < 7){
			$('#postfix_number').val($('#postfix_number').val()+$(this).attr('title'));
		}

		return false;
	});

	$("input#postfix_number").keyup(function(){
		if($(this).val().length > 7){
			$(this).val($(this).val().substr(0, 7));
		}
	});

	//show_selected_numnber();

	 var hash = window.location.hash;
	  hash && $('ul.nav a[href="' + hash + '"]').tab('show');

	  $('.nav-tabs a').click(function (e) {
		$(this).tab('show');
		var scrollmem = $('body').scrollTop();
		window.location.hash = this.hash;
		$('html,body').scrollTop(scrollmem);
	  });
});

function add_to_cart(params){
	params.action_type = 'add_to_cart';
	if(params.product != '' && params.number != ''){
		$.ajax({
			url: _AJAX_PROCESS_URL,
			data: params,
			type: 'POST',
			async: true,
			success: function(response){
				
				$('#blk_message').show().html(response);
                $('.back_button').show();
				$('.continue_button').show();
                $('html, body').animate({
                    scrollTop: $('.continue_button').offset().top
                }, 1000);
			}
		});
	}
}

function show_selected_numnber(params){
	var selected_number = $('#tollfree_number').val();

	if(selected_number.length > 0){
		var display_message = '<div class="alert alert-info"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Selected Number: ' + selected_number + ' Setup Fee: 0.00$ Monthly Fee: 0.99$ Per Minute Fee: 0.02$</div>';
		$('#blk_message').show().html(display_message);
	}
}

function get_tollfree_numbers(prefix){
	$('#result_panel').html('<div class="loader">Searching for numbers...</div>');
	$.ajax({
		url: _AJAX_PROCESS_URL,
		data: {action_type:'get_number', prefix:prefix},
		type: 'POST',
		async: true,
		success: function(response){
			$('#result_panel').html(response);
		}
	});
}

function get_vanity_tollfree(){
	var prefix = $('select[name="prefix"]').val();
	var number = $('input[name="postfix_number"]').val();
	/****making sure that smaller number doesn't generate error*/
	var num_len=number.length;
	if(num_len<7)
	{
		for(var i=0; i<(7-num_len); i++)
		{
			number+='*';
		}
	}
	/******************************************************************/
	//console.log(check_search_clicks('tollfree_vanity'));

	// if(prefix !== '' && eval(number) > 0){
	if(prefix !== '' && number.length==7){
		if(check_search_clicks('tollfree_vanity') == false){
			return false;
		}

		$('#vtf_result_panel').html('<div class="loader">Searching for numbers...</div>');
		$.ajax({
			url: _AJAX_PROCESS_URL,
			data: {action_type:'get_vanity_tollfree', prefix:prefix, number:number},
			type: 'POST',
			async: true,
			success: function(response){
				$('#vtf_result_panel').html(response);
			}
		});
	} else {
		$('#vtf_result_panel').html('<div class="loader">Invalid number entered...</div>');
	}
}


function get_carrier_tollfree(){
	var number = $('input[name="postfix_number_1"]').val();
	/****making sure that smaller number doesn't generate error*/
	var num_len=number.length;
// 	if(num_len<7)
// 	{
// 		for(var i=0; i<(7-num_len); i++)
// 		{
// 			number+='*';
// 		}
// 	}
	/******************************************************************/
	//console.log(check_search_clicks('tollfree_vanity'));
// alert(number);
	if(number.length > 0){
		if(check_search_clicks('tollfree_carrier') == false){alert(1);
			return false;
		}
// alert(1);
		$('#vtf_result_panel_1').html('<div class="loader">Searching for numbers...</div>');
		$.ajax({
			url: _AJAX_PROCESS_URL,
			data: {action_type:'get_carrier_tollfree', number:number},
			type: 'POST',
			async: true,
			success: function(response){
				$('#vtf_result_panel_1').html(response);
			}
		});
	} else {
		$('#vtf_result_panel_1').html('<div class="loader">Invalid number entered...</div>');
	}
}
function check_search_clicks(search_type){
	var is_search_clicks_available = true;
	var warn_message = '';

	$.ajax({
		url: _AJAX_PROCESS_URL,
		data: {action_type:'check_search_clicks', search_type:search_type},
		type: 'POST',
		async: true,
		global: true,
		success: function(response){			
			if(response < 50){
				warn_message = 'You have ' + (50-eval(response)) + ' Vanity Toll Free Search Available';
			}else{
				is_search_clicks_available = false;
				$('#btn_vanity_search').attr("disabled", true);
				warn_message = 'You have 0 Vanity Toll Free Search Available';
			}

			$('#vanity_available_search_text').html(warn_message);			
		}
	});

	return is_search_clicks_available;
}

function get_local_numbers(type, pre_label){
	var send_request = false;
	var params = {};

	if(type == 'INT'){
		var objSelCountry = $('select[name="'+pre_label+'_country"] option:selected');
		var country_id = objSelCountry.val();
		var country_code = objSelCountry.attr('cc');
		var state_code = $('select[name="'+pre_label+'_state"]').val();
                var num_location = $('#ww_num_location').val();
                var phonesearch = $('#ww_phonesearch').val();
                var match_to = $('#ww_match_to').val();
                var capabilities = $('#ww_capabilities').prop('checked');
                var capabilities_voice = $('#ww_capabilities_voice').is(':checked');
                var capabilities_fax = $('#ww_capabilities_fax').is(':checked');
                var capabilities_sms = $('#ww_capabilities_sms').is(':checked');
                var capabilities_mms = $('#ww_capabilities_mms').is(':checked');
		var extraparam = "num_location=" + num_location + "&phonesearch=" + encodeURIComponent(phonesearch) + "&match_to=" + encodeURIComponent(match_to) + "&capabilities=" + capabilities + "&capabilities_voice=" + capabilities_voice + "&capabilities_fax=" + capabilities_fax + "&capabilities_sms=" + capabilities_sms + "&capabilities_mms=" + capabilities_mms;
		params = {action_type:'get_international_number', ci:country_id, cc:country_code, sc:state_code, ep:extraparam};
		send_request = true;

	}else if(type == 'LOCAL'){
		var prefix = $('select[name="'+pre_label+'_area"] option:selected').val();
		var state_code = $('select[name="'+pre_label+'_state"]').val();

		if(eval(prefix) > 0){
			params = {action_type:'get_local_number', prefix:prefix, sc:state_code};
			send_request = true;
		}
	}

	$('#'+pre_label+'_result_panel').html('<div class="loader">Searching for numbers...</div>');

	if(send_request === true){
		$.ajax({
			url: _AJAX_PROCESS_URL,
			data: params,
			type: 'POST',
			async: true,
			success: function(response){
				$('#'+pre_label+'_result_panel').html(response);
			}
		});
	}
}

function get_worldwide_numbers(pre_label){
        var country_id = $('select[name="'+pre_label+'_country"] option:selected').val();

        //if(country_id != '211' && country_id != '37'){
                get_local_numbers('INT', pre_label);
                return false;
        //} else {
	//	get_local_numbers('', pre_label);
	//	return false;
	//}
}
function get_states(pre_label){
	var objSelCountry = $('select[name="'+pre_label+'_country"] option:selected');
	var country_id = objSelCountry.val();
	var country_code = objSelCountry.attr('cc');

	$('select[name="'+pre_label+'_state"]').empty();
	var html_option = '<option value="">-Select-</option>';

	if(country_id === ''){
		$('select[name="'+pre_label+'_state"]').html(html_option);
		$('.blk_area').hide();
		return false;
	}

	if(country_id == '211'){
		$('.blk_area_'+pre_label).show();
	}else{
		$('.blk_area_'+pre_label).hide();
	}

	$.ajax({
		url: _AJAX_PROCESS_URL,
		data: {action_type:'get_states', ci:country_id, cc:country_code},
		dataType:'json',
		type: 'POST',
		async: true,
		success: function(response){
			$.each(response, function(key, item){
				html_option += '<option value="'+key+'">'+item+'</option>';
			});

			$('select[name="'+pre_label+'_state"]').html(html_option);
		}
	});
}

function get_area_codes(pre_label){
	var country_id = $('select[name="'+pre_label+'_country"] option:selected').val();

	if(country_id != '211'){
		get_local_numbers('INT', pre_label);
		return false;
	}

	var state_code = $('select[name="'+pre_label+'_state"]').val();

	$('select[name="'+pre_label+'_area"]').empty();
	var html_option = '<option value="">-Select-</option>';

	if(state_code === ''){
		$('select[name="'+pre_label+'_area"]').html(html_option);
		return false;
	}

	$.ajax({
		url: _AJAX_PROCESS_URL,
		data: {action_type:'get_areas', sc:state_code},
		dataType:'json',
		type: 'POST',
		async: true,
		success: function(response){
			$.each(response, function(key, item){
				html_option += '<option value="' + item.areacode + '">' + item.areacode + ' - ' + item.city + '</option>';
			});

			$('select[name="'+pre_label+'_area"]').html(html_option);
		}
	});
}

function toggle_ring_type(){
	var data_classes = 'form-control required ';
	var ring_data_title = 'Enter a US Number :';
	var str_place_holder = '1XXX-XXX-XXX';

	var ring_type = $('#ring_type').val();

	if(typeof(ring_type_array[ring_type]) != 'undefined'){
		ring_data_title = ring_type_array[ring_type].title;
		data_classes += ring_type_array[ring_type].class_name;
		str_place_holder = ring_type_array[ring_type].placeholder;
	}

	$("#ring_to_data").attr('class', data_classes);
	$("#ring_to_data").attr('placeholder', str_place_holder);
	$('.lbl_ring_data').html(ring_data_title);
}
